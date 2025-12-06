import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from "react-hot-toast";
import ConfirmationModal from '../components/ConfirmationModal';
import UpdateProductDetailsModal from '../components/UpdateProductDetailsModal';
import AddProductModal from '../components/AddProductModal';
import BulkAddProductsModal from '../components/BulkAddProductsModal';
import Pagination from '../components/Pagination';

export default function ProductManagement() {

  const API_URL = import.meta.env.VITE_API_URL;

  const [products, setProducts] = useState([])

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)

  // Modal state
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showUpdateProductDetailsModal, setShowUpdateProductDetailsModal] = useState(false)
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showBulkAddProductsModal, setShowBulkAddProductsModal] = useState(false);
  const [showDeleteProductConfirmationModal, setShowDeleteProductConfirmationModal] = useState(false)
  const [showBulkDeleteProductsConfirmationModal, setShowBulkDeleteProductsConfirmationModal] = useState(false)

  const [skuId, setSkuId] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isActive, setIsActive] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  const fetchProducts = async() => {
    if(isLoading) return;
    try{
        setIsLoading(true);

        const url = API_URL + `/products`;

        const params = {
            page: currentPage,
            page_size: pageSize,
            sku_id: skuId,
            name: name,
            description: description,
            is_active: isActive
        }

        const response = await axios({
            url,
            method: 'GET',
            params
        });

        const responseData = response?.data;
        console.log(responseData)

        if (responseData) {
            const { total_pages, total_records, products } = responseData.data;
            setTotalPages(total_pages);
            setProducts(products);
            setTotalRecords(total_records);
        }
    }
    catch(error){
        const errorMessage = error?.response?.data?.message || error?.message;
        toast.error(errorMessage);
    }
    finally{
        setIsLoading(false);
    }
  }

  useEffect(() => {
    const handler = setTimeout(() => {  
      fetchProducts();
    }, 500)

    return () => clearTimeout(handler) 
  }, [currentPage, name, skuId, description, isActive]);

  const deleteProductHandler=async()=>{
      if(isExecuting) return;

      try{
          setIsExecuting(true);
          const url = API_URL + `/products/${selectedProduct.id}`;

          const response = await axios({
              url,
              method: 'DELETE'
          });
          const responseData = response?.data;

          setShowDeleteProductConfirmationModal(false);
          setSelectedProduct(null);
          // refresh the products
          fetchProducts();
      }
      catch(error){
          const errorMessage = error?.response?.data?.message || error.message;
          toast.error(errorMessage);
      }
      finally{
          setIsExecuting(false);
      }
  }

  const bulkDeleteProductsHandler=async()=>{
      if(isExecuting) return;

      try{
          setIsExecuting(true);
          const url = API_URL + `/products/bulk`;

          const response = await axios({
              url,
              method: 'DELETE'
          });
          const responseData = response?.data;
          const message = responseData.message;
          toast.success(message);
          // refresh the products
          setShowBulkDeleteProductsConfirmationModal(false);
          fetchProducts();
      }
      catch(error){
          const errorMessage = error?.response?.data?.message || error.message;
          toast.error(errorMessage);
      }
      finally{
          setIsExecuting(false);
      }
  }

  const handleProductDetailsUpdate = async(productId, updatedData)=>{
    setProducts((prev) =>
        prev.map((product) =>
            product.id === productId ? { ...product, ...updatedData } : product
        )
    );
  }

  const handlePageChange = (page) =>{
    setCurrentPage(page)
  }

  return (
      <div className="py-4 px-6 bg-gray-50 min-h-screen">
          {/* Header */}
          <div className="">
              <div className="flex items-center justify-between mb-0">
                  <div>
                      <h1 className="text-xl font-bold text-gray-900 mb-0">Products Importer</h1>
                      <p className="text-s text-gray-600 mb-2">Manage products</p>
                  </div>
                  <div className='flex flex-row gap-3'>
                      <button
                          className="bg-[#94BF30] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#7CA126] transition-colors text-sm"
                          onClick={() => {
                            setShowBulkDeleteProductsConfirmationModal(true);
                          }}
                      >
                          Bulk Delete
                      </button>
                      <button
                          className="bg-[#94BF30] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#7CA126] transition-colors text-sm"
                          onClick={() => {
                            setShowBulkAddProductsModal(true)
                          }}
                      >
                          Bulk Add
                      </button>
                      <button
                          className="bg-[#94BF30] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#7CA126] transition-colors text-sm"
                          onClick={() => {
                            setShowAddProductModal(true)
                          }}
                      >
                          + Add New
                      </button>
                  </div>
              </div>

              <div className="mb-3 flex flex-wrap items-center gap-3">

                <input
                  type="text"
                  placeholder="SKU"
                  value={skuId}
                  onChange={(e) => setSkuId(e.target.value)}
                  className="px-3 py-2 border rounded-md w-48 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />

                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-3 py-2 border rounded-md w-48 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />

                <input
                  type="text"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="px-3 py-2 border rounded-md w-64 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />

                <select
                  value={isActive}
                  onChange={(e) => setIsActive(e.target.value)}
                  className="px-3 py-2 border rounded-md w-36 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>

                {/* Clear filters button */}
                <button
                  onClick={() => {
                    setSkuId('')
                    setName('')
                    setDescription('')
                    setIsActive('')
                  }}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Clear Filters
                </button>
              </div>

          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mt-3">
              {isLoading ? (
                  <div className="flex items-center justify-center py-20">
                      <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                          <p className="text-sm text-gray-600">Fetching products...</p>
                      </div>
                  </div>
              ) : (
                  <div className="overflow-auto max-h-[78vh]">
                      <table className="w-full min-w-[1200px] text-sm">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="px-4 py-3 text-center w-24 font-semibold text-gray-900">S.No</th>
                              <th className="px-4 py-3 text-center w-60 font-semibold text-gray-900">SKU ID</th>
                              <th className="px-4 py-3 text-center w-60 font-semibold text-gray-900">Product Name</th>
                              <th className="px-4 py-3 text-center min-w-60 max-w-80 font-semibold text-gray-900">Description</th>
                              <th className="px-4 py-3 text-center w-32 font-semibold text-gray-900">Active Status</th>
                              <th className="px-4 py-3 text-center w-32 font-semibold text-gray-900">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                              {products?.length > 0 ? (
                                products.map((product, index) => (
                                  <tr
                                    key={product.id}
                                    className="hover:bg-blue-50 transition-colors cursor-pointer"
                                  >
                                    <td className="px-4 py-2 text-center max-w-24">{(currentPage - 1) * pageSize + index + 1}</td>
                                    <td className="px-4 py-2  text-center font-mono text-gray-700 max-w-60">{product.sku_id}</td>
                                    <td className="px-4 py-2  text-center font-medium text-gray-800 max-w-60">{product.name}</td>
                                    <td className="px-4 py-2 text-center  text-gray-700 max-w-80">{product.description}</td>
                                    <td className="px-4 py-2 text-center">
                                      {product.is_active ? (
                                        <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                                          Active
                                        </span>
                                      ) : (
                                        <span className="px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
                                          Inactive
                                        </span>
                                      )}
                                    </td>

                                    <td className="px-4 py-2 text-center">
                                      <div className="flex items-center justify-center gap-2">
                                        {/* Edit Button */}
                                        <button
                                          onClick={() => {
                                            setSelectedProduct(product)
                                            setShowUpdateProductDetailsModal(true)
                                          }}
                                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                          title="Edit product"
                                        >
                                          <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                            />
                                          </svg>
                                        </button>

                                        {/* Delete Button */}
                                        <button
                                          onClick={() => {
                                            setSelectedProduct(product)
                                            setShowDeleteProductConfirmationModal(true)
                                          }}
                                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                          title="Delete product"
                                        >
                                          <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                          </svg>
                                        </button>
                                      </div>
                                    </td>
                                </tr>
                              ))
                              ) : (
                                <tr>
                                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                    No products found
                                  </td>
                                </tr>
                              )}
                          </tbody>
                      </table>
                  </div>
              )}
              {totalPages > 1 && (
                          <div className="px-4 py-1 border-t border-gray-200 bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    Showing <span className="font-medium">{pageSize}</span> rows per page
                                    <span className="mx-2">•</span>
                                    <span className="font-medium">{totalRecords}</span> total results
                                </div>
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                          </div>
                      )}
          </div>
          {
              showUpdateProductDetailsModal && <UpdateProductDetailsModal
                  productDetails={selectedProduct}
                  setProductDetails={setSelectedProduct}
                  showModal={showUpdateProductDetailsModal}
                  setShowModal={setShowUpdateProductDetailsModal}
                  onUpdate={handleProductDetailsUpdate}
              />
          }
          {
            showAddProductModal && <AddProductModal 
              showModal={showAddProductModal}
              setShowModal={setShowAddProductModal}
              onUpdate={fetchProducts}
            />
          }
          {
            showBulkAddProductsModal && <BulkAddProductsModal 
              showModal={showBulkAddProductsModal}
              setShowModal={setShowBulkAddProductsModal}
              onUpdate={fetchProducts}
            />
          }

          

          <ConfirmationModal
                  isOpen={showDeleteProductConfirmationModal && selectedProduct}
                  onClose={()=>{
                      setSelectedProduct(null);
                      setShowDeleteProductConfirmationModal(false);
                  }}
                  onConfirm={deleteProductHandler}
                  title="Delete Product"
                  cancelText="Cancel"
                  confirmText={isExecuting ? 'Deleting...' : 'Yes, Delete Product'}
                  confirmButtonClass="bg-[#94BF30] hover:bg-[#7CA126] focus:ring-[#94BF30]"
                  headerClass="bg-gradient-to-r from-blue-50 to-indigo-50"
                  isLoading={isExecuting}
                  >
                  <div className="space-y-3">
                      <div>
                      <h4 className="font-medium text-gray-900">Permanent Deletion</h4>
                      <p className="text-sm text-gray-600 mt-1">This action cannot be undone.</p>
                      </div>
                      <p className="text-sm">
                      Are you sure you want to delete product{' '}
                      <span className="font-medium text-gray-900">"{selectedProduct?.name}"</span>?
                      </p>
                  </div>
          </ConfirmationModal>

          <ConfirmationModal
                  isOpen={showBulkDeleteProductsConfirmationModal}
                  onClose={()=>{
                      setShowBulkDeleteProductsConfirmationModal(false);
                  }}
                  onConfirm={bulkDeleteProductsHandler}
                  title="Bulk Delete Products"
                  cancelText="Cancel"
                  confirmText={isExecuting ? 'Deleting...' : 'Yes, Delete Products'}
                  confirmButtonClass="bg-[#94BF30] hover:bg-[#7CA126] focus:ring-[#94BF30]"
                  headerClass="bg-gradient-to-r from-blue-50 to-indigo-50"
                  isLoading={isExecuting}
                  >
                  <div className="space-y-3">
                      <div>
                      <h4 className="font-medium text-gray-900">Permanent Deletion</h4>
                      <p className="text-sm text-gray-600 mt-1">This action cannot be undone.</p>
                      </div>
                      <p className="text-sm">
                      Are you sure you want to delete all products?
                      </p>
                  </div>
          </ConfirmationModal>
      </div>
  )
}
