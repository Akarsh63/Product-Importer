from db import SessionLocal
from models import Product
from sqlalchemy import and_
import logging
import csv
import codecs
from sqlalchemy.dialects.postgresql import insert
from fastapi import HTTPException
from datetime import datetime
from sqlalchemy import func
from websocket import manager
import asyncio

async def getProductsHandler(payload):
    page = payload['page']
    page_size = payload['page_size']
    filters = []

    if payload["sku_id"]:
            filters.append(Product.sku_id == payload["sku_id"])

    if payload["name"]:
        filters.append(Product.name.ilike(f"%{payload['name']}%"))

    if payload["description"]:
        filters.append(Product.description.ilike(f"%{payload['description']}%"))

    if payload["is_active"] is not None:
        filters.append(Product.is_active == payload["is_active"])

    session = SessionLocal()
    try: 
        query = session.query(Product).filter(and_(*filters))

        paginated_query = query.offset((page -1) * page_size).limit(page_size)

        paginated_products = paginated_query.all()
        total_records = query.count()
        total_pages = total_records//page_size

        return {
            'page': page,
            'total_pages': total_pages,
            'total_records': total_records,
            'products': paginated_products
        }
    
    except Exception as e:
        logging.error(f"Error in get products handler: {e}")
        raise e
    
    finally:
         session.close()

async def createProductHandler(data):
    session = SessionLocal()
    try: 
        existing_product = session.query(Product).filter(Product.sku_id == data.sku_id).first()

        if existing_product:
            existing_product.is_active = True
            existing_product.name = data.name
            existing_product.description = data.description
            session.commit()
        else:
            new_product = Product(**data.dict())

            session.add(new_product)
            session.commit()

    except Exception as e:
        logging.error(f"Error in create product handler: {e}")
        raise e
    
    finally:
         session.close()

async def updateProductDetailsHandler(product_id, data):
    session = SessionLocal()
    try: 
        new_sku = data.get("sku_id")
        if new_sku: 
         existing_product = session.query(Product).filter(Product.sku_id == new_sku).first()
         if existing_product:
            raise HTTPException(
                status_code=400,
                detail=f"SKU already exists for another product {existing_product.name}"
            )

        session.query(Product).filter(Product.id == product_id).update(data)
        session.commit()

    except Exception as e:
        logging.error(f"Error in update product details handler: {e}")
        raise e
    
    finally:
         session.close()

async def deleteProductHandler(product_id):

    session = SessionLocal()
    try: 
        session.query(Product).filter(Product.id == product_id).delete()
        session.commit()

    except Exception as e:
        logging.error(f"Error in delete product handler: {e}")
        raise e
    
    finally:
         session.close()

async def deleteProductsBulkHandler():

    session = SessionLocal()
    try: 
        deleted_count = session.query(Product).delete()
        session.commit()

        return deleted_count
    
    except Exception as e:
        session.rollback()
        logging.error(f"Error in deleting products bulk handler: {e}")
        raise e
    
    finally:
         session.close()


async def processProductsBatch(batch):
    session = SessionLocal()
    try:
        clean_batch = []
        for row in batch:
            mapped = {
                "sku_id": row.get("sku"),
                "name": row.get("name"),
                "description": row.get("description"),
                "is_active": True,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }

            clean_batch.append(mapped)

        stmt = insert(Product).values(clean_batch)
        
        # ON CONFLICT on SKU → update existing rows
        stmt = stmt.on_conflict_do_update(
            index_elements=['sku_id'],
            set_={
                'name': stmt.excluded.name,
                'description': stmt.excluded.description,
                'is_active': stmt.excluded.is_active,
                'updated_at': func.now()
            }
        )
        
        session.execute(stmt)
        session.commit()
    
    except Exception as e:
        session.rollback()
        raise e

async def createProductsBulkHandler(file, client_id):
    # count the number of rows
    file.file.seek(0)
    total_rows = sum(1 for _ in codecs.iterdecode(file.file, 'utf-8')) - 1
    file.file.seek(0)

    processed_rows = 0
    batch_size = 50
    batch = []
    try: 
        for row in csv.DictReader(codecs.iterdecode(file.file, 'utf-8')):
            batch.append(row)
            
            if len(batch) == batch_size:
                try: 
                    await processProductsBatch(batch)
                    batch.clear()

                    processed_rows += batch_size

                    processed_percentage = (processed_rows / total_rows) * 100
                    # Send progress to client
                    await manager.send_progress(client_id, {
                        "processed_rows": processed_rows,
                        "total_rows": total_rows,
                        "percentage": processed_percentage
                    })
                    await asyncio.sleep(0)

                except Exception as e:
                    raise e
                
        if len(batch) > 0:
            try: 
                await processProductsBatch(batch)

            except Exception as e:
                raise e

    except Exception as e:
        raise e