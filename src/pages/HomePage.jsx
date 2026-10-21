import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import DestinationDiscovery from '../components/DestinationDiscovery';
import PopularDestinations from '../components/PopularDestinations';
import HowItWorks from '../components/HowItWorks';
import CampusMap from '../components/CampusMap';
import ScrollReveal from '../components/ScrollReveal';
import { 
  Compass, 
  ArrowRight, 
  Users, 
  Calendar, 
  MapPin, 
  Sparkles, 
  Clock, 
  MessageSquare, 
  ThumbsUp,
  Maximize2
} from 'lucide-react';
import { DEMO_EVENTS } from '../data/campusData';
import { loadCommunityPosts } from '../data/communityData';

export default function HomePage({
  nodes = [],
  rooms = [],
  edges = [],
  favorites = [],
  onToggleFavorite,
  recentSearches = [],
  onAddRecentSearch,
}) {
  const navigate = useNavigate();
  const communityPosts = loadCommunityPosts().slice(0, 3);
  const featuredEvents = DEMO_EVENTS.slice(0, 2);

  const handleSelectDestination = (nodeId) => {
    navigate(`/map?dest=${nodeId}`);
  };

  const handleSelectRoom = (roomObj) => {
    navigate(`/map?dest=${roomObj.blockId}&room=${roomObj.id}`);
  };

  const handleSelectStart = (nodeId) => {
    navigate(`/map?start=${nodeId}`);
  };

  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-white via-[#FAF9FF] to-[#F8FAFC] pt-16 sm:pt-20 pb-16 px-4 border-b border-[#E8EAF2] overflow-hidden">
        {/* Ambient Radial Lavender Glow */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] pointer-events-none opacity-40 blur-3xl -z-10"
          style={{
            background: 'radial-gradient(circle, rgba(99,91,255,0.18) 0%, rgba(243,240,255,0.1) 50%, transparent 75%)'
          }}
        ></div>

        <ScrollReveal direction="up" delay={50}>
          <div className="relative max-w-4xl mx-auto text-center space-y-6">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3F0FF] border border-[#E0DBFF] text-xs font-semibold text-[#635BFF] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#635BFF] animate-pulse"></span>
              <span className="tracking-wide">LOVELY PROFESSIONAL UNIVERSITY · WAYFINDING</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight leading-[1.12]">
              Every Destination.<br />
              <span className="text-[#635BFF]">One Clear Direction.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[#64748B] max-w-2xl mx-auto leading-relaxed font-normal">
              Find academic blocks, lecture halls, campus gates, hostels, and essential facilities with intelligent campus navigation.
            </p>

            {/* Large Search Component */}
            <div className="pt-2 max-w-2xl mx-auto">
              <SearchBar
                nodes={nodes}
                rooms={rooms}
                onSelectDestination={handleSelectDestination}
                onSelectStart={handleSelectStart}
                onSelectRoom={handleSelectRoom}
                favorites={favorites}
                onToggleFavorite={onToggleFavorite}
                recentSearches={recentSearches}
                onAddRecentSearch={onAddRecentSearch}
              />

              {/* Quick Suggestions */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-[#64748B]">
                <span className="text-[#94A3B8] font-medium mr-1">Quick Suggestions:</span>
                
                <button
                  onClick={() => navigate('/map?dest=block-34')}
                  className="px-3 py-1 rounded-full bg-white hover:bg-[#F3F0FF] border border-[#E8EAF2] hover:border-[#C7BDFF] text-[#0F172A] hover:text-[#635BFF] font-medium transition-all shadow-xs"
                >
                  Block 34 (CSE)
                </button>

                <button
                  onClick={() => navigate('/map?start=gate-1&dest=block-34')}
                  className="px-3 py-1 rounded-full bg-white hover:bg-[#F3F0FF] border border-[#E8EAF2] hover:border-[#C7BDFF] text-[#0F172A] hover:text-[#635BFF] font-medium transition-all shadow-xs"
                >
                  Gate 1 → Block 34
                </button>

                <button
                  onClick={() => navigate('/destinations/block-34')}
                  className="px-3 py-1 rounded-full bg-white hover:bg-[#F3F0FF] border border-[#E8EAF2] hover:border-[#C7BDFF] text-[#0F172A] hover:text-[#635BFF] font-medium transition-all shadow-xs"
                >
                  Seminar Hall (34-205)
                </button>

                <button
                  onClick={() => navigate('/map?dest=hospital')}
                  className="px-3 py-1 rounded-full bg-white hover:bg-[#F3F0FF] border border-[#E8EAF2] hover:border-[#C7BDFF] text-[#0F172A] hover:text-[#635BFF] font-medium transition-all shadow-xs"
                >
                  University Hospital
                </button>
              </div>
            </div>

          </div>
        </ScrollReveal>
      </section>

      {/* MAIN HOME BODY */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        
        {/* COMPACT MAP PREVIEW TEASER */}
        <ScrollReveal direction="up" delay={100}>
          <section className="bg-white rounded-3xl border border-[#E8EAF2] p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#635BFF]"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#635BFF]">
                  Live Navigation Engine
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
                Interactive Campus Map Preview
              </h2>
              <p className="text-sm text-[#64748B] mt-1">
                Explore campus blocks, calculate shortest pedestrian routes, and inspect indoor room guidance.
              </p>
            </div>

            <Link
              to="/map"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#635BFF] hover:bg-[#5145E5] text-white rounded-xl text-sm font-semibold shadow-sm transition-all self-start md:self-auto"
            >
              <Compass className="w-4 h-4" />
              <span>Launch Full-Screen Map</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Interactive Map Preview Box */}
          <div className="relative rounded-2xl overflow-hidden border border-[#E8EAF2]">
            <CampusMap
              nodes={nodes}
              edges={edges}
              startNodeId="gate-1"
              destinationNodeId="block-34"
              activeRoute={null}
              onSelectNode={(node) => navigate(`/destinations/${node.id}`)}
              onSetStart={(id) => navigate(`/map?start=${id}`)}
              onSetDestination={(id) => navigate(`/map?dest=${id}`)}
            />
            
            {/* Overlay hint banner */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md border border-[#E8EAF2] px-4 py-3 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-2 text-xs text-[#0F172A] font-medium">
                <MapPin className="w-4 h-4 text-[#635BFF]" />
                <span>Showing Hero Target: <strong>Block 34 (School of CSE)</strong> from <strong>Gate 1 (GT Road)</strong></span>
              </div>
              <Link
                to="/map?start=gate-1&dest=block-34"
                className="text-xs font-semibold text-[#635BFF] hover:text-[#5145E5] flex items-center gap-1"
              >
                <span>Plan Route on Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* POPULAR CAMPUS DESTINATIONS */}
      <ScrollReveal direction="up" delay={120}>
        <PopularDestinations
          rooms={rooms}
          onSelectDestination={handleSelectDestination}
          onSelectRoom={handleSelectRoom}
        />
      </ScrollReveal>

      {/* DESTINATION DISCOVERY (6 CATEGORIES) */}
      <ScrollReveal direction="up" delay={140}>
        <DestinationDiscovery
          onSelectCategory={(viewId) => {
            if (viewId === 'events') {
              navigate('/events');
            } else {
              navigate('/destinations');
            }
          }}
          onSelectQuickDestination={(nodeId) => {
            navigate(`/destinations/${nodeId}`);
          }}
        />
      </ScrollReveal>

      {/* CAMPUS CONNECT COMMUNITY PREVIEW */}
      <ScrollReveal direction="up" delay={160}>
        <section className="bg-white rounded-3xl border border-[#E8EAF2] p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#10B981]">
                  Campus Connect
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
                Student Community & Lost & Found
              </h2>
              <p className="text-sm text-[#64748B] mt-1">
                Real-time questions, lost item alerts, and transit tips linked to campus buildings.
              </p>
            </div>

            <Link
              to="/community"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-[#F3F0FF] text-[#0F172A] hover:text-[#635BFF] rounded-xl text-xs sm:text-sm font-semibold transition-colors self-start sm:self-auto"
            >
              <Users className="w-4 h-4" />
              <span>Explore Community Feed</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 3 Featured Community Post Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {communityPosts.map((post, idx) => (
              <ScrollReveal key={post.id} direction="up" delay={idx * 60}>
                <div
                  onClick={() => navigate(`/community/${post.id}`)}
                  className="group bg-[#FAF9FF]/50 hover:bg-white rounded-2xl border border-[#E8EAF2] hover:border-[#C7BDFF] p-5 shadow-xs hover:shadow-card-hover transition-all duration-200 cursor-pointer flex flex-col justify-between h-full"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border border-[#E8EAF2] text-[#635BFF]">
                        {post.category}
                      </span>
                      <span className="text-[11px] text-[#94A3B8] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.timestamp}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#0F172A] group-hover:text-[#635BFF] transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-xs text-[#64748B] mt-2 line-clamp-2 leading-relaxed">
                      {post.body}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#64748B]">
                    <div className="flex items-center gap-1 text-[11px] text-[#635BFF] font-medium truncate max-w-[150px]">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{post.locationName}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-[11px]">
                        <ThumbsUp className="w-3 h-3" /> {post.upvotes}
                      </span>
                      <span className="flex items-center gap-1 text-[11px]">
                        <MessageSquare className="w-3 h-3" /> {post.comments.length}
                      </span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* UPCOMING CAMPUS EVENTS PREVIEW */}
      <ScrollReveal direction="up" delay={180}>
        <section className="bg-white rounded-3xl border border-[#E8EAF2] p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                  Campus Updates
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
                Upcoming Events & Examination Mode
              </h2>
              <p className="text-sm text-[#64748B] mt-1">
                Designated visitor gates, examination hall notices, and venue navigation.
              </p>
            </div>

            <Link
              to="/events"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-[#F3F0FF] text-[#0F172A] hover:text-[#635BFF] rounded-xl text-xs sm:text-sm font-semibold transition-colors self-start sm:self-auto"
            >
              <Calendar className="w-4 h-4" />
              <span>All Campus Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredEvents.map((evt, idx) => (
              <ScrollReveal key={evt.id} direction="up" delay={idx * 80}>
                <div
                  className="bg-[#FAF9FF]/50 rounded-2xl border border-[#E8EAF2] p-5 flex flex-col justify-between h-full"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                        {evt.urgency === 'high' ? 'High Traffic Exam' : 'Official Notice'}
                      </span>
                      <span className="text-xs font-semibold text-[#64748B]">
                        {evt.date}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#0F172A]">
                      {evt.title}
                    </h3>

                    <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                      {evt.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-xs font-medium text-[#64748B]">
                      Recommended Entry: <strong className="text-[#0F172A] uppercase">{evt.recommendedGate}</strong>
                    </div>
                    <Link
                      to={`/map?dest=${evt.primaryDestinationId}&start=${evt.recommendedGate}`}
                      className="px-3 py-1.5 bg-[#635BFF] hover:bg-[#5145E5] text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1"
                    >
                      <span>Navigate Venue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* HOW IT WORKS 4 STEPS */}
      <ScrollReveal direction="up" delay={200}>
        <HowItWorks />
      </ScrollReveal>

    </div>
  </div>
  );
}
