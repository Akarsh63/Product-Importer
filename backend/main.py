from fastapi import FastAPI, HTTPException, File, UploadFile, WebSocket, WebSocketDisconnect, Form
from db import create_tables
from typing import Optional
from contextlib import asynccontextmanager
from handlers.productsHandler import getProductsHandler, createProductHandler, deleteProductHandler, updateProductDetailsHandler, deleteProductsBulkHandler, createProductsBulkHandler
from models import Product
from schemas import ProductSchema, ProductUpdateSchema
from fastapi.middleware.cors import CORSMiddleware
from websocket import manager

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    yield

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:5173",
    "https://product-importer-eight.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(client_id, websocket)
    try:
        while True:
            # Keep the connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(client_id)

@app.get('/')
async def root():
    return {
        "message": 'Server is running!'
    }

@app.get('/products')
async def getProductsController(
    page: int = 1, 
    page_size: int = 10,
    sku_id: Optional[str] = None,
    name: Optional[str] = None,
    description: Optional[str] = None,
    is_active: Optional[bool] = None
):
    try: 
        payload = {
            'page': page,
            'page_size': page_size,
            'sku_id': sku_id,
            'name': name,
            'description': description,
            'is_active': is_active
        }
        result = await getProductsHandler(payload)

        return {
            'status': True,
            'message': 'Fetched products successflly',
            'data': result
        }

    except Exception as e:
        error_message = str(e)
        raise HTTPException(status_code=500, detail={
            'status': False,
            'message': error_message,
        })

@app.post('/products')
async def createProductController(data: ProductSchema):
    try: 
        await createProductHandler(data)

        return {
            'status': True,
            'message': 'Product created successflly',
        }

    except Exception as e:
        error_message = str(e)
        raise HTTPException(status_code=500, detail={
            'status': False,
            'message': error_message,
        })

@app.post('/products/bulk-upload-csv')
async def createProductsBulkController(file: UploadFile , client_id: str = Form(...)):
    try: 
        if not file:
            raise HTTPException(status_code=404, detail="No upload file sent")

        await createProductsBulkHandler(file, client_id)

        return {
            'status': True,
            'message': 'Products uploaded successflly',
        }

    except Exception as e:
        error_message = str(e)
        raise HTTPException(status_code=500, detail={
            'status': False,
            'message': error_message,
        })

@app.put('/products/{product_id}')
async def updateProductDetailsController(product_id: int, data: ProductUpdateSchema):

    try: 
        payload = data.model_dump(exclude_unset = True)

        # validation 
        if not payload:
            raise HTTPException(status_code=404, detail="Please send valid fields to update")

        await updateProductDetailsHandler(product_id, payload)

        return {
            'status': True,
            'message': 'Product deleted successflly',
        }

    except Exception as e:
        error_message = str(e)
        raise HTTPException(status_code=500, detail={
            'status': False,
            'message': error_message,
        })

@app.delete('/products/bulk')
async def deleteProductsBulkController():

    try: 
        deleted_count = await deleteProductsBulkHandler()

        return {
            'status': True,
            'message': f'Bulk deleted {deleted_count} products successfully',
        }

    except Exception as e:
        error_message = str(e)
        raise HTTPException(status_code=500, detail={
            'status': False,
            'message': error_message,
        })

@app.delete('/products/{product_id}')
async def deleteProductController(product_id: int):
    try: 
        await deleteProductHandler(product_id)

        return {
            'status': True,
            'message': 'Product deleted successflly',
        }

    except Exception as e:
        error_message = str(e)
        raise HTTPException(status_code=500, detail={
            'status': False,
            'message': error_message,
        })
