import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Phone, ExternalLink, Filter, X,
  Heart, Shield, BookOpen, Users, Sparkles, Home,
  Building2, ChevronDown
} from 'lucide-react';
import { nycResources, resourceCategories } from '../data/resources';
import { useNYCHealthFacilities } from '../hooks/useNYCData';

const boroughs = ['All Boroughs', 'Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island', 'Citywide'];

const catIconMap = {
  health: Heart,
  housing: Home,
  legal: BookOpen,
  food: Heart,
  community: Users,
  youth: Sparkles,
};

const catColorMap = {
  health: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  housing: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  legal: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
  food: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  community: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
  youth: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
};

export default function ResourcesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBorough, setSelectedBorough] = useState('All Boroughs');
  const [showFilters, setShowFilters] = useState(false);

  const { data: nycFacilities, loading: facilitiesLoading } = useNYCHealthFacilities();

  // Transform NYC API data into our format
  const apiFacilities = useMemo(() => {
    if (!nycFacilities.length) return [];
    return nycFacilities.slice(0, 20).map((f, i) => ({
      id: `nyc-api-${i}`,
      name: f.facility_name || f.name || 'NYC Health Facility',
      category: 'health',
      description: `NYC Health + Hospitals facility providing healthcare services.${f.facility_type ? ` Type: ${f.facility_type}.` : ''}`,
      address: [f.address, f.borough].filter(Boolean).join(', '),
      phone: f.phone || null,
      borough: f.borough ? f.borough.charAt(0).toUpperCase() + f.borough.slice(1).toLowerCase() : 'Citywide',
      services: ['General Healthcare'],
      fromAPI: true,
    }));
  }, [nycFacilities]);

  const allResources = useMemo(() => {
    return [...nycResources, ...apiFacilities];
  }, [apiFacilities]);

  const filtered = useMemo(() => {
    return allResources.filter((r) => {
      const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
      const matchesBorough =
        selectedBorough === 'All Boroughs' ||
        r.borough === selectedBorough ||
        r.borough === 'Citywide';
      const matchesSearch =
        !searchQuery ||
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.services && r.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesCategory && matchesBorough && matchesSearch;
    });
  }, [allResources, selectedCategory, selectedBorough, searchQuery]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="hero-gradient min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight mb-4">
            Resource <span className="pride-gradient-text">Directory</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            LGBTQIA+ affirming services across New York City — health, housing, legal, food, community, and youth programs.
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          {/* Search bar */}
          <div className="relative mb-4">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search resources, services, organizations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-white/15 text-white'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              All
            </button>
            {resourceCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-white/15 text-white'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Borough filter */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={selectedBorough}
                onChange={(e) => setSelectedBorough(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-violet-500/50 cursor-pointer"
              >
                {boroughs.map((b) => (
                  <option key={b} value={b} className="bg-slate-900">{b}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            </div>
            <span className="text-sm text-slate-500">
              {filtered.length} resource{filtered.length !== 1 ? 's' : ''} found
              {facilitiesLoading && ' (loading NYC data...)'}
            </span>
          </div>
        </motion.div>

        {/* Resource cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((resource, i) => {
              const Icon = catIconMap[resource.category] || Heart;
              const colorClass = catColorMap[resource.category] || catColorMap.health;

              return (
                <motion.div
                  key={resource.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: Math.min(i * 0.03, 0.3) }}
                  className="card-hover rounded-2xl border border-white/5 bg-white/[0.02] p-6"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-base font-semibold text-white leading-snug">{resource.name}</h3>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
                      {resourceCategories.find(c => c.id === resource.category)?.name || resource.category}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mb-4 leading-relaxed">{resource.description}</p>

                  {resource.address && (
                    <div className="flex items-start gap-2 text-sm text-slate-500 mb-2">
                      <MapPin size={14} className="mt-0.5 shrink-0" />
                      {resource.address}
                    </div>
                  )}

                  {resource.phone && (
                    <a
                      href={`tel:${resource.phone.replace(/[^0-9]/g, '')}`}
                      className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-2 transition-colors"
                    >
                      <Phone size={14} />
                      {resource.phone}
                    </a>
                  )}

                  {resource.services && resource.services.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3 mb-3">
                      {resource.services.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 bg-white/5 rounded text-xs text-slate-400"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/5">
                    {resource.borough && (
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin size={11} />
                        {resource.borough}
                      </span>
                    )}
                    {resource.website && (
                      <a
                        href={resource.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors ml-auto"
                      >
                        <ExternalLink size={11} />
                        Website
                      </a>
                    )}
                    {resource.fromAPI && (
                      <span className="text-xs text-cyan-500/50 ml-auto">via NYC Open Data</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Search size={40} className="mx-auto text-slate-600 mb-4" />
            <p className="text-slate-400 text-lg">No resources match your filters.</p>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your search or category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
