import { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // Import UUID generator
import { Search, Settings, Plus, Edit, X, Trash2, Download, ChevronUp, ChevronDown } from 'lucide-react';
import Sidebar from '../../components/admin/sidebar';
import axiosInstance from '../../axios';
import { uploadImage, uploadMultipleImages } from '../../firebase/image';
import { Switch } from '@headlessui/react'; // Add this import
import { toast } from 'react-hot-toast';


export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/category');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleProductClick = (product) => {
    const fetchProductVariants = async () => {
      try {
        const response = await axiosInstance.get(`/products_varient?product_id=${product.id}`);
        const variants = response.data?.Productvarients || [];
        const sortedVariants = variants.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
        setSelectedProduct({ ...product, variants: sortedVariants });
      } catch (error) {
        console.error('Error fetching product variants:', error);
      }
    };

    fetchProductVariants();
    setIsAddingProduct(false);
  };

  const handleAddProduct = () => {
    setSelectedProduct({
      name: '',
      description: '',
      is_active: true,
      is_featured: false,
      images: [], 
      variants: [{ name: '', price: 0, mrp: 0, stock: 0, is_active: true }],
      category_id: '',
    });
    setIsAddingProduct(true);
  };

  const handleSaveProduct = async (product) => {
    try {
      if (!product.variants || product.variants.length === 0) {
        toast.error('Product must have at least one variant');
        return;
      }

      const hasActiveVariant = product.variants.some(variant => variant.is_active);
      if (product.is_active && !hasActiveVariant) {
        toast.error('Product cannot be active without at least one active variant');
        return;
      }

      if (!hasActiveVariant) {
        product.is_active = false;
      }

      product.variants = product.variants.map((variant, index) => ({
        ...variant,
        display_order: variant.display_order ?? index
      }));

      if (isAddingProduct) {
        const response = await axiosInstance.post('/products', product);
        product.id = response.data.primary.id;
        fetchProducts();
      } else {
        const response = await axiosInstance.put(`/products/${product.id}`, product);
        fetchProducts();
      }

      for (const variant of product.variants) {
        if (variant.id) {
          await axiosInstance.put(`/products_varient/${variant.id}`, variant);
        } else {
          await axiosInstance.post('/products_varient', { ...variant, product_id: product.id });
        }
      }

      setSelectedProduct(null);
      setIsAddingProduct(false);
      toast.success('Product saved successfully');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    }
  };

  const handleAddVariant = () => {
    const maxOrder = Math.max(...selectedProduct.variants.map(v => v.display_order ?? 0), -1);
    setSelectedProduct({
      ...selectedProduct,
      variants: [
        ...selectedProduct.variants,
        { name: '', price: 0, is_active: true, display_order: maxOrder + 1 },
      ],
    });
  };

  const handleUpdateVariant = (index, field, value) => {
    const updatedVariants = [...selectedProduct.variants];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    setSelectedProduct({ ...selectedProduct, variants: updatedVariants });
  };

  const handleRemoveVariant = (index) => {
    const updatedVariants = selectedProduct.variants.filter((_, i) => i !== index);
    setSelectedProduct({ ...selectedProduct, variants: updatedVariants });
  };

  const handleAddImage = (field) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = async (e) => {
      try {
        const file = e.target.files[0];
        const imageUrl = await uploadImage(file, 'products');
        
        const updatedProduct = { ...selectedProduct };
        updatedProduct.images.push(imageUrl);
        setSelectedProduct(updatedProduct);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    };
    fileInput.click();
  };

  const handleUpdateImage = (field, index, imageIndex, value) => {
    const updatedProduct = { ...selectedProduct };
    if (index !== null) {
      updatedProduct.variants[index].images[imageIndex] = value;
    } else {
      updatedProduct.images[imageIndex] = value;
    }
    setSelectedProduct(updatedProduct);
  };

  const handleRemoveImage = (imageIndex) => {
    const updatedProduct = { ...selectedProduct };
    updatedProduct.images.splice(imageIndex, 1);
    setSelectedProduct(updatedProduct);
  };

  const sortProducts = (products) => {
    return [...products].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'category') {
        aValue = categories.find(c => c.id === a.category_id)?.name || '';
        bValue = categories.find(c => c.id === b.category_id)?.name || '';
      }
      
      const comparison = aValue > bValue ? 1 : -1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  const handleExportToExcel = () => {
    const csvData = filteredProducts.map(product => ({
      Name: product.name,
      Category: categories.find(c => c.id === product.category_id)?.name || '-',
      Status: product.is_active ? 'Active' : 'Inactive',
      Variants: product.variants?.length || 0,
      Description: product.description
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `products-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredProducts = products?.products
    ?.filter(product => 
      (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       product.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (categoryFilter ? product.category_id === categoryFilter : true) &&
      (statusFilter === 'all' ? true : product.is_active === (statusFilter === 'active'))
    );

  const sortedProducts = sortProducts(filteredProducts || []);

  const handleProductActiveToggle = (checked) => {
    const hasActiveVariant = selectedProduct.variants.some(variant => variant.is_active);
    if (checked && !hasActiveVariant) {
      toast.error('Cannot activate product without at least one active variant');
      return;
    }
    setSelectedProduct({ ...selectedProduct, is_active: checked });
  };

  const handleStatusToggle = async (productId, newStatus) => {
    try {
      const product = products.products.find(p => p.id === productId);
      if (!product) return;

      // Check if product has any active variants before activating
      if (newStatus) {
        const response = await axiosInstance.get(`/products_varient?product_id=${productId}`);
        const variants = response.data?.Productvarients || [];
        const hasActiveVariant = variants.some(variant => variant.is_active);
        
        if (!hasActiveVariant) {
          toast.error('Cannot activate product without active variants');
          return;
        }
      }

      // Update product status
      await axiosInstance.put(`/products/${productId}`, {
        ...product,
        is_active: newStatus
      });

      // Refresh products list
      await fetchProducts();
      toast.success(`Product ${newStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error updating product status:', error);
      toast.error('Failed to update product status');
    }
  };

  // Function to move variant up
  const moveVariantUp = (index) => {
    if (index > 0) {
      const newVariants = [...selectedProduct.variants];
      const tempOrder = newVariants[index].display_order;
      newVariants[index].display_order = newVariants[index - 1].display_order;
      newVariants[index - 1].display_order = tempOrder;
      [newVariants[index], newVariants[index - 1]] = [newVariants[index - 1], newVariants[index]];
      setSelectedProduct({ ...selectedProduct, variants: newVariants });
    }
  };

  // Function to move variant down
  const moveVariantDown = (index) => {
    if (index < selectedProduct.variants.length - 1) {
      const newVariants = [...selectedProduct.variants];
      const tempOrder = newVariants[index].display_order;
      newVariants[index].display_order = newVariants[index + 1].display_order;
      newVariants[index + 1].display_order = tempOrder;
      [newVariants[index], newVariants[index + 1]] = [newVariants[index + 1], newVariants[index]];
      setSelectedProduct({ ...selectedProduct, variants: newVariants });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <header className="bg-green-500 shadow-sm border-b z-10">
          <div className="px-6 py-4">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-800">Products</h1>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleAddProduct}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
                  >
                    <Plus size={20} className="mr-2" />
                    Add Product
                  </button>
                  <button
                    onClick={handleExportToExcel}
                    className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
                  >
                    <Download size={20} className="mr-2" />
                    Export
                  </button>
                </div>
              </div>
              
              {/* Filters Section */}
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
                
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 min-w-[150px] focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 min-w-[120px] focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-hidden bg-gray-100 p-6">
          <div className="bg-white rounded-lg shadow h-full flex flex-col">
            {/* Table Header */}
            <div className="bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-4 px-6 py-3">
                {['Name', 'Category', 'Status', 'Actions'].map((header, index) => (
                  <div
                    key={header}
                    onClick={() => {
                      const field = header.toLowerCase();
                      if (sortField === field) {
                        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortField(field);
                        setSortDirection('asc');
                      }
                    }}
                    className={`text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 flex items-center ${
                      index === 3 ? 'justify-end' : ''
                    }`}
                  >
                    <span>{header}</span>
                    {sortField === header.toLowerCase() && (
                      <span className="ml-2 text-gray-400">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Scrollable Table Body */}
            <div className="flex-1 overflow-auto">
              {sortedProducts.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No products found
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {sortedProducts.map((product) => (
                    <div key={product.id} className="grid grid-cols-4 px-6 py-4 hover:bg-gray-50">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            src={product.images[0] || '/placeholder.png'}
                            alt=""
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">
                            {product.variants?.length || 0} variants
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        {categories.find(c => c.id === product.category_id)?.name || '-'}
                      </div>
                      <div className="flex items-center">
                        <Switch
                          checked={product.is_active}
                          onChange={(checked) => handleStatusToggle(product.id, checked)}
                          className={`${
                            product.is_active ? 'bg-green-600' : 'bg-gray-200'
                          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
                        >
                          <span
                            className={`${
                              product.is_active ? 'translate-x-6' : 'translate-x-1'
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                          />
                        </Switch>
                      </div>
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => handleProductClick(product)}
                          className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                          <Edit size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {(selectedProduct || isAddingProduct) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {isAddingProduct ? 'Add New Product' : 'Edit Product'}
                  </h2>
                  <button
                    onClick={() => {
                      setSelectedProduct(null);
                      setIsAddingProduct(false);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="p-6">
                  {selectedProduct && (
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveProduct(selectedProduct);
                    }}>
                      <div className="space-y-6">
                        {/* Basic Info */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                              <input
                                type="text"
                                value={selectedProduct.name}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                              <select
                                value={selectedProduct.category_id}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, category_id: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              >
                                <option value="">Select a category</option>
                                {categories.map((category) => (
                                  <option key={category.id} value={category.id}>
                                    {category.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                              value={selectedProduct.description}
                              onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              rows="3"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Base Price</label>
                              <input
                                type="number"
                                value={selectedProduct.base_price}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, base_price: parseFloat(e.target.value) })}
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Discounted Price</label>
                              <input
                                type="number"
                                value={selectedProduct.discounted_price}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, discounted_price: parseFloat(e.target.value) })}
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              />
                            </div>
                          </div>

                          <div className="flex space-x-6">
                            <div className="flex items-center">
                              <label className="mr-3 text-sm font-medium text-gray-700">Active</label>
                              <Switch
                                checked={selectedProduct.is_active}
                                onChange={handleProductActiveToggle}
                                className={`${
                                  selectedProduct.is_active ? 'bg-green-600' : 'bg-gray-200'
                                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                              >
                                <span className={`${
                                  selectedProduct.is_active ? 'translate-x-6' : 'translate-x-1'
                                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                              </Switch>
                            </div>
                            
                            <div className="flex items-center">
                              <label className="mr-3 text-sm font-medium text-gray-700">Featured</label>
                              <Switch
                                checked={selectedProduct.is_featured}
                                onChange={(checked) => setSelectedProduct({ ...selectedProduct, is_featured: checked })}
                                className={`${
                                  selectedProduct.is_featured ? 'bg-green-600' : 'bg-gray-200'
                                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                              >
                                <span className={`${
                                  selectedProduct.is_featured ? 'translate-x-6' : 'translate-x-1'
                                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                              </Switch>
                            </div>
                          </div>
                        </div>

                        {/* Variants */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Product Variants</h3>
                            <button
                              type="button"
                              onClick={handleAddVariant}
                              className="bg-white text-[#0d2946] hover:bg-green-50 px-4 py-2 rounded-lg flex items-center border border-green-600"
                            >
                              <Plus size={16} className="mr-2" />
                              Add Variant
                            </button>
                          </div>
                          <div className="space-y-4">
                            {selectedProduct.variants.map((variant, index) => (
                              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between items-start mb-4">
                                  <h4 className="text-sm font-medium text-gray-700">Variant {index + 1}</h4>
                                  <div className="flex items-center space-x-2">
                                    <button
                                      type="button"
                                      onClick={() => moveVariantUp(index)}
                                      disabled={index === 0}
                                      className={`p-1.5 rounded-full transition-colors duration-200 ${
                                        index === 0
                                          ? 'text-gray-300 cursor-not-allowed'
                                          : 'text-[#0d2946] hover:bg-green-50'
                                      }`}
                                      title="Move up"
                                    >
                                      <ChevronUp size={18} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => moveVariantDown(index)}
                                      disabled={index === selectedProduct.variants.length - 1}
                                      className={`p-1.5 rounded-full transition-colors duration-200 ${
                                        index === selectedProduct.variants.length - 1
                                          ? 'text-gray-300 cursor-not-allowed'
                                          : 'text-[#0d2946] hover:bg-green-50'
                                      }`}
                                      title="Move down"
                                    >
                                      <ChevronDown size={18} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveVariant(index)}
                                      className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50 transition-colors duration-200"
                                      title="Remove variant"
                                    >
                                      <Trash2 size={18} />
                                    </button>
                                  </div>
                                </div>

                                <div className="grid grid-cols-4 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Name
                                    </label>
                                    <input
                                      type="text"
                                      value={variant.name}
                                      onChange={(e) => handleUpdateVariant(index, 'name', e.target.value)}
                                      className="w-full border border-gray-300 rounded-lg p-2.5"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Price
                                    </label>
                                    <input
                                      type="number"
                                      value={variant.price}
                                      onChange={(e) => handleUpdateVariant(index, 'price', parseFloat(e.target.value))}
                                      className="w-full border border-gray-300 rounded-lg p-2.5"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      MRP
                                    </label>
                                    <input
                                      type="number"
                                      value={variant.mrp}
                                      onChange={(e) => handleUpdateVariant(index, 'mrp', parseFloat(e.target.value))}
                                      className="w-full border border-gray-300 rounded-lg p-2.5"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Active
                                    </label>
                                    <Switch
                                      checked={variant.is_active ?? true}
                                      onChange={(checked) => handleUpdateVariant(index, 'is_active', checked)}
                                      className={`${variant.is_active ? 'bg-green-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none mt-2`}
                                    >
                                      <span className={`${variant.is_active ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                                    </Switch>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Images */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Product Images</h3>
                            <button
                              type="button"
                              onClick={() => handleAddImage('images')}
                              className="bg-white text-[#0d2946] hover:bg-green-50 px-4 py-2 rounded-lg flex items-center border border-green-600"
                            >
                              <Plus size={16} className="mr-2" />
                              Add Image
                            </button>
                          </div>
                          <div className="grid grid-cols-4 gap-4">
                            {selectedProduct.images.map((image, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={image}
                                  alt={`Product ${index + 1}`}
                                  className="w-full h-24 object-cover rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(index)}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end pt-6">
                        <button
                          type="submit"
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors duration-200"
                        >
                          Save Product
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}