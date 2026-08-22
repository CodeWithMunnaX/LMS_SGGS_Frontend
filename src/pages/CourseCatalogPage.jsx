import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  Grid,
  List,
  RotateCcw,
  Sparkles,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Filter,
  X
} from 'lucide-react';
import courseService from '../services/courseService';
import CourseCard from '../components/CourseCard';
import Badge from '../components/Badge';

export const CourseCatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);

  // Filters State
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [level, setLevel] = useState(searchParams.get('level') || 'All');
  const [priceType, setPriceType] = useState(searchParams.get('priceType') || 'all');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const categoriesList = [
    'All',
    'Web Development',
    'Data Science & AI',
    'UI/UX Design',
    'Mobile App Development',
    'Cloud Computing & DevOps',
    'Cybersecurity'
  ];

  const levelsList = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Sync state when URL params change
  useEffect(() => {
    const urlKeyword = searchParams.get('keyword') || '';
    const urlCategory = searchParams.get('category') || 'All';
    const urlLevel = searchParams.get('level') || 'All';
    const urlPriceType = searchParams.get('priceType') || 'all';
    const urlMinRating = searchParams.get('minRating') || '';
    const urlSort = searchParams.get('sort') || 'newest';
    const urlPage = Number(searchParams.get('page')) || 1;

    setKeyword(urlKeyword);
    setCategory(urlCategory);
    setLevel(urlLevel);
    setPriceType(urlPriceType);
    setMinRating(urlMinRating);
    setSort(urlSort);
    setPage(urlPage);

    fetchCourses({
      keyword: urlKeyword,
      category: urlCategory,
      level: urlLevel,
      priceType: urlPriceType,
      minRating: urlMinRating,
      sort: urlSort,
      page: urlPage
    });
  }, [searchParams]);

  const fetchCourses = async (paramsObj) => {
    setLoading(true);
    try {
      const data = await courseService.getCourses(paramsObj);
      setCourses(data.courses || []);
      setTotalPages(data.totalPages || 1);
      setTotalCourses(data.total || 0);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (newParams = {}) => {
    const updated = {
      keyword,
      category: category !== 'All' ? category : undefined,
      level: level !== 'All' ? level : undefined,
      priceType: priceType !== 'all' ? priceType : undefined,
      minRating: minRating || undefined,
      sort,
      page: 1,
      ...newParams
    };

    // Clean undefined/empty
    const cleaned = {};
    Object.keys(updated).forEach((k) => {
      if (updated[k] !== undefined && updated[k] !== '' && updated[k] !== 'All') {
        cleaned[k] = updated[k];
      }
    });

    setSearchParams(cleaned);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    applyFilters({ keyword, page: 1 });
  };

  const handleClearFilters = () => {
    setKeyword('');
    setCategory('All');
    setLevel('All');
    setPriceType('all');
    setMinRating('');
    setSort('newest');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div className="space-y-2 sm:space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="indigo" size="sm">
            <Sparkles className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
            <span>COURSE CATALOG</span>
          </Badge>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Explore All Courses
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Learn from industry-tested instructors with rich video lectures, downloadable cheat sheets, and verified completion credentials.
        </p>
      </div>

      {/* Main Search & Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="w-full md:w-96 relative">
          <input
            type="text"
            placeholder="Search by topic, framework, skill..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </form>

        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-transparent"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">Sort:</span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                applyFilters({ sort: e.target.value });
              }}
              className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 text-xs font-semibold text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="newest">Newest Releases</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Sidebar Filters + Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Filter Sidebar (Desktop) */}
        <div className="hidden lg:block glass-panel p-6 rounded-2xl space-y-6 sticky top-24">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Filters</h3>
            </div>
            <button
              onClick={handleClearFilters}
              className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Category
            </label>
            <div className="space-y-1">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategory(cat);
                    applyFilters({ category: cat !== 'All' ? cat : undefined });
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    category === cat
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Level Filter */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Difficulty Level
            </label>
            <div className="space-y-1">
              {levelsList.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    setLevel(lvl);
                    applyFilters({ level: lvl !== 'All' ? lvl : undefined });
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    level === lvl
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Pricing
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {['all', 'free', 'paid'].map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setPriceType(p);
                    applyFilters({ priceType: p !== 'all' ? p : undefined });
                  }}
                  className={`py-1.5 text-center rounded-lg text-xs font-bold capitalize transition-colors ${
                    priceType === p
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              Showing <strong className="text-slate-900 dark:text-white">{courses.length}</strong> of{' '}
              <strong className="text-slate-900 dark:text-white">{totalCourses}</strong> courses
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="glass-card rounded-2xl h-80 animate-pulse bg-slate-200/60 dark:bg-slate-800/40" />
              ))}
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {courses.map((c) => (
                <CourseCard key={c._id} course={c} />
              ))}
            </div>
          ) : (
            <div className="glass-panel rounded-3xl p-12 text-center space-y-4">
              <BookOpen className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No courses found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Try adjusting your search terms or clearing your active filters to view all available courses.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-glow"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                onClick={() => applyFilters({ page: page - 1 })}
                disabled={page <= 1}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 px-4">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => applyFilters({ page: page + 1 })}
                disabled={page >= totalPages}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-sm lg:hidden animate-fadeIn">
          <div className="w-80 max-w-[80vw] bg-white dark:bg-slate-900 h-full p-6 overflow-y-auto space-y-6 ml-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Filter Courses</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Category</label>
              <div className="space-y-1">
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategory(cat);
                      applyFilters({ category: cat !== 'All' ? cat : undefined });
                      setIsMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                      category === cat
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                handleClearFilters();
                setIsMobileFilterOpen(false);
              }}
              className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseCatalogPage;
