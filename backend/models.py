from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Boolean
from db import Base
from datetime import datetime

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    sku_id = Column(String, nullable=False, unique=True, index=True)
    description = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.now)
    updated_at =  Column(DateTime, default=datetime.now, onupdate=datetime.now)