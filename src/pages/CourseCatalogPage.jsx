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
  Filter
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

    // Clean undefined
    Object.keys(updated).forEach((key) => updated[key] === undefined && delete updated[key]);

    setSearchParams(updated);
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

  const handlePageChange = (newPage) => {
    setPage(newPage);
    applyFilters({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="indigo" size="sm">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>COURSE CATALOG</span>
          </Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Explore All Courses
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
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
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </form>

        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-xl text-xs font-bold text-slate-200"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Sort:</span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                applyFilters({ sort: e.target.value });
              }}
              className="bg-slate-900 border border-slate-700/80 text-xs font-semibold text-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500"
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
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Filters</h3>
            </div>
            <button
              onClick={handleClearFilters}
              className="text-[11px] font-semibold text-slate-400 hover:text-indigo-400 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
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
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Level Filter */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
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
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Price
            </label>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: 'all', label: 'All' },
                { id: 'free', label: 'Free' },
                { id: 'paid', label: 'Paid' }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setPriceType(p.id);
                    applyFilters({ priceType: p.id !== 'all' ? p.id : undefined });
                  }}
                  className={`py-1.5 rounded-lg text-xs font-medium text-center transition-colors ${
                    priceType === p.id
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Minimum Rating
            </label>
            <div className="space-y-1">
              {[
                { label: '4.5 & up', val: '4.5' },
                { label: '4.0 & up', val: '4.0' },
                { label: '3.0 & up', val: '3.0' }
              ].map((r) => (
                <button
                  key={r.val}
                  onClick={() => {
                    const nextVal = minRating === r.val ? '' : r.val;
                    setMinRating(nextVal);
                    applyFilters({ minRating: nextVal || undefined });
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    minRating === r.val
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold'
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                  }`}
                >
                  ★ {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing <strong className="text-white">{courses.length}</strong> of{' '}
              <strong className="text-white">{totalCourses}</strong> available courses
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="glass-card rounded-2xl h-80 animate-pulse bg-slate-800/40" />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="glass-panel rounded-2xl p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">No matching courses found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try adjusting your search keyword or relaxing filter options.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[...Array(totalPages)].map((_, i) => {
                const pageNumber = i + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                      page === pageNumber
                        ? 'bg-indigo-600 text-white shadow-glow'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              <button
                disabled={page >= totalPages}
                onClick={() => handlePageChange(page + 1)}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-800 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCatalogPage;
