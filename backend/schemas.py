from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProductSchema(BaseModel):
    sku_id: str
    name: str
    description: str

class ProductUpdateSchema(BaseModel):
    sku_id: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None