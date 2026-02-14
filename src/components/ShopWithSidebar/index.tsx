'use client'
import { useSearchParams } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import Breadcrumb from '../Common/Breadcrumb'
import CustomSelect from './CustomSelect'
import CategoryDropdown from './CategoryDropdown'
// Removed unused imports: GenderDropdown, SizeDropdown, ColorsDropdwon
import PriceDropdown from './PriceDropdown'
import SingleGridItem from '../Shop/SingleGridItem'
import SingleListItem from '../Shop/SingleListItem'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { fetchProducts } from '@/redux/slices/productsSlice'
import { fetchCategories } from '@/redux/slices/categorySlice'
import { useForm } from 'react-hook-form'
import PreLoader from '../Common/PreLoader'
import Pagination from '../Common/Pagination'

const ShopWithSidebar = () => {
  const searchParams = useSearchParams()
  const categoryIdParam = searchParams.get('categoryId')
  const searchParam = searchParams.get('search')

  const dispatch = useAppDispatch()
  const { products, loading, pagination } = useAppSelector(
    (state) => state.productsReducer
  )
  const { categories } = useAppSelector((state) => state.categoriesReducer)

  const [productStyle, setProductStyle] = useState('grid')
  const [productSidebar, setProductSidebar] = useState(false)
  const [stickyMenu, setStickyMenu] = useState(false)

  // Local page state
  const [page, setPage] = useState(1)

  const { register, watch, handleSubmit, setValue } = useForm({
    defaultValues: {
      search: searchParam || '',
      categoryId: categoryIdParam || undefined,
      sort: 'newest'
    }
  })

  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | undefined>(undefined)
  // Key to force re-render PriceDropdown on reset
  const [resetKey, setResetKey] = useState(0)

  // Debounce price update to avoid too many API calls
  const [debouncedPriceRange, setDebouncedPriceRange] = useState(priceRange)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPriceRange(priceRange)
    }, 500)
    return () => clearTimeout(timer)
  }, [priceRange])

  // Sync URL params if they change
  useEffect(() => {
    if (categoryIdParam) {
      setValue('categoryId', categoryIdParam)
    } else {
      setValue('categoryId', undefined)
    }
    
    if (searchParam) {
      setValue('search', searchParam)
    } else {
      setValue('search', '')
    }
  }, [categoryIdParam, searchParam, setValue])

  const filterValues = watch()

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [filterValues.categoryId, filterValues.sort, filterValues.search, debouncedPriceRange])

  useEffect(() => {
    dispatch(fetchCategories(undefined))
  }, [dispatch])

  useEffect(() => {
    const searchValue = filterValues.search?.trim() || undefined
    
    dispatch(
      fetchProducts({
        page: page,
        itemsPerPage: 9,
        /* @ts-ignore */
        categoryId: filterValues.categoryId,
        /* @ts-ignore */
        sort: filterValues.sort,
        search: searchValue,
        minPrice: debouncedPriceRange?.min,
        maxPrice: debouncedPriceRange?.max
      })
    )
  }, [dispatch, page, filterValues.categoryId, filterValues.sort, filterValues.search, debouncedPriceRange])

  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true)
    } else {
      setStickyMenu(false)
    }
  }

  const options = [
    { label: 'Latest Products', value: 'newest' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Name: A-Z', value: 'name_asc' },
    { label: 'Name: Z-A', value: 'name_desc' },
    { label: 'Highest Rating', value: 'rating' }
  ]

  /* Mock data for untyped dropdowns for now to prevent breaking UI */
  const genders = [
    { name: 'Men', products: 10 },
    { name: 'Women', products: 23 },
    { name: 'Unisex', products: 8 }
  ]

  useEffect(() => {
    window.addEventListener('scroll', handleStickyMenu)
    function handleClickOutside(event: any) {
      if (!event.target.closest('.sidebar-content')) {
        setProductSidebar(false)
      }
    }
    if (productSidebar) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })

  return (
    <>
      <Breadcrumb
        title={'Explore All Products'}
        pages={['shop', '/', 'shop with sidebar']}
      />
      <section className='overflow-hidden relative pb-20 pt-5 lg:pt-20 xl:pt-28 bg-[#f3f4f6]'>
        <div className='max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0'>
          <div className='flex gap-7.5'>
            {/* <!-- Sidebar Start --> */}
            <div
              className={`sidebar-content fixed xl:z-1 z-9999 left-0 top-0 xl:translate-x-0 xl:static max-w-[310px] xl:max-w-[270px] w-full ease-out duration-200 ${
                productSidebar
                  ? 'translate-x-0 bg-white p-5 h-screen overflow-y-auto'
                  : '-translate-x-full'
              }`}
            >
              <button
                onClick={() => setProductSidebar(!productSidebar)}
                aria-label='button for product sidebar toggle'
                className={`xl:hidden absolute -right-12.5 sm:-right-8 flex items-center justify-center w-8 h-8 rounded-md bg-white shadow-1 ${
                  stickyMenu
                    ? 'lg:top-20 sm:top-34.5 top-35'
                    : 'lg:top-24 sm:top-39 top-37'
                }`}
              >
                Close
              </button>

              <form onSubmit={handleSubmit(() => {})}>
                <div className='flex flex-col gap-6'>
                  {/* <!-- filter box --> */}
                  <div className='bg-white shadow-1 rounded-lg py-4 px-5'>
                    <div className='flex items-center justify-between'>
                      <p>Filters:</p>
                      <button 
                        className='text-blue' 
                        type='button'
                        onClick={() => {
                          setValue('search', '')
                          setValue('categoryId', undefined)
                          setValue('sort', 'newest')
                          setPriceRange(undefined)
                          setResetKey(prev => prev + 1)
                        }}
                      >
                        Clean All
                      </button>
                    </div>
                  </div>

                  {/* <!-- category box --> */}
                  <div className='bg-white shadow-1 rounded-lg p-5'>
                    <h3 className='mb-4 font-medium text-dark'>Categories</h3>
                    <div className='flex flex-col gap-3'>
                      {categories.map((cat: any) => (
                        <label key={cat.id} className='cursor-pointer'>
                          <input
                            type='radio'
                            value={cat.id}
                            {...register('categoryId')}
                            className='mr-2'
                          />
                          {cat.name}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* <!-- gender box: REMOVED as unsupported --> */}
                  {/* <!-- size box: REMOVED as unsupported --> */}
                  {/* <!-- color box: REMOVED as unsupported --> */}

                  {/* // <!-- price range box --> */}
                  <PriceDropdown 
                    key={resetKey} // Force reset when key changes
                    onChange={(val) => setPriceRange(val)} 
                  />
                </div>
              </form>
            </div>
            {/* // <!-- Sidebar End --> */}

            {/* // <!-- Content Start --> */}
            <div className='xl:max-w-[870px] w-full'>
              <div className='rounded-lg bg-white shadow-1 pl-3 pr-2.5 py-2.5 mb-6'>
                <div className='flex items-center justify-between'>
                  {/* <!-- top bar left --> */}
                  <div className='flex flex-wrap items-center gap-4'>
                    {/* Simplified select for demo */}
                    <select
                      {...register('sort')}
                      className='p-2 border rounded'
                    >
                      {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>

                    <p>
                      {loading && 'Loading...'}
                      {!loading && `Showing ${products.length} Products`}
                    </p>
                  </div>

                  {/* <!-- top bar right --> */}
                  <div className='flex items-center gap-2.5'>
                    <button
                      onClick={() => setProductStyle('grid')}
                      className={`${
                        productStyle === 'grid'
                          ? 'bg-blue border-blue text-white'
                          : 'text-dark bg-gray-1 border-gray-3'
                      } flex items-center justify-center w-10.5 h-9 rounded-[5px] border ease-out duration-200 hover:bg-blue hover:border-blue hover:text-white`}
                    >
                      Grid
                    </button>

                    <button
                      onClick={() => setProductStyle('list')}
                      className={`${
                        productStyle === 'list'
                          ? 'bg-blue border-blue text-white'
                          : 'text-dark bg-gray-1 border-gray-3'
                      } flex items-center justify-center w-10.5 h-9 rounded-[5px] border ease-out duration-200 hover:bg-blue hover:border-blue hover:text-white`}
                    >
                      List
                    </button>
                  </div>
                </div>
              </div>

              {/* <!-- Products Grid Tab Content Start --> */}
              <div
                className={`${
                  productStyle === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7.5 gap-y-9'
                    : 'flex flex-col gap-7.5'
                }`}
              >
                {loading ? (
                  <PreLoader />
                ) : (
                  products.map((item, key) =>
                    productStyle === 'grid' ? (
                      <SingleGridItem item={item} key={key} />
                    ) : (
                      <SingleListItem item={item} key={key} />
                    )
                  )
                )}
              </div>
              {/* <!-- Products Grid Tab Content End --> */}

              {/* <!-- Products Pagination Start --> */}
              <div className='flex justify-center mt-15'>
                <Pagination
                  currentPage={page}
                  totalPages={pagination.totalPages}
                  onPageChange={(page) => setPage(page)}
                />
              </div>
              {/* <!-- Products Pagination End --> */}
            </div>
            {/* // <!-- Content End --> */}
          </div>
        </div>
      </section>
    </>
  )
}

export default ShopWithSidebar
