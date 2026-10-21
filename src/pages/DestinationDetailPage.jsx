import { 
  Building2, 
  Navigation, 
  MapPin, 
  ArrowLeft, 
  Star, 
  Layers, 
  CheckCircle2, 
  MessageSquare,
  ThumbsUp
} from 'lucide-react';
import { loadCommunityPosts } from '../data/communityData';

export default function DestinationDetailPage({
  nodes = [],
  rooms = [],
  favorites = [],
  onToggleFavorite,
  _onOpenLast50m,
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const node = useMemo(() => {
    return nodes.find(n => n.id === id || n.code === id) || null;
  }, [nodes, id]);

  const buildingRooms = useMemo(() => {
    if (!node) return [];
    return rooms.filter(r => r.blockId === node.id || r.blockNumber === node.code);
  }, [rooms, node]);

  const communityPosts = useMemo(() => {
    if (!node) return [];
    const allPosts = loadCommunityPosts();
    return allPosts.filter(p => p.locationId === node.id);
  }, [node]);

  if (!node) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <Building2 className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
        <h2 className="text-xl font-bold text-[#0F172A]">Destination Not Found</h2>
        <p className="text-xs text-[#64748B] mt-1">
          The requested campus building or landmark "{id}" could not be located in our directory.
        </p>
        <Link
          to="/destinations"
          className="inline-flex items-center gap-1.5 px-4 py-2 mt-4 bg-[#635BFF] text-white rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Destinations</span>
        </Link>
      </div>
    );
  }

  const isFav = favorites.includes(node.id);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Breadcrumb & Back */}
      <div className="flex items-center justify-between">
        <Link
          to="/destinations"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#635BFF] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Destinations</span>
        </Link>

        <button
          onClick={() => onToggleFavorite && onToggleFavorite(node.id)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
            isFav 
              ? 'bg-amber-50 border-amber-200 text-amber-700' 
              : 'border-[#E8EAF2] text-[#64748B] hover:bg-slate-50'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400 text-amber-500' : ''}`} />
          <span>{isFav ? 'Bookmarked' : 'Add to Favorites'}</span>
        </button>
      </div>

      {/* Building Header Card */}
      <div className="bg-white rounded-3xl border border-[#E8EAF2] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F3F0FF] text-[#635BFF] border border-[#E0DBFF]">
                {node.category.toUpperCase()} • {node.zone}
              </span>
              {node.isHeroBlock && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
                  Campus Hero Block
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              {node.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] max-w-2xl leading-relaxed">
              {node.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 flex-shrink-0">
            <button
              onClick={() => navigate(`/map?dest=${node.id}`)}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#635BFF] hover:bg-[#5145E5] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions</span>
            </button>
            <button
              onClick={() => navigate(`/map?start=${node.id}`)}
              className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Start from Here</span>
            </button>
          </div>
        </div>

        {/* Building Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#E8EAF2]">
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Building Code</span>
            <div className="text-base font-bold text-[#0F172A] mt-0.5">Block {node.code}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Campus Zone</span>
            <div className="text-base font-bold text-[#0F172A] mt-0.5">{node.zone}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Floors</span>
            <div className="text-base font-bold text-[#0F172A] mt-0.5">{node.floors || 'Ground + 4'} Floors</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Accessibility</span>
            <div className="text-xs font-bold text-emerald-700 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Ramp & Elevator
            </div>
          </div>
        </div>

        {/* Facilities Badges */}
        {node.facilities && node.facilities.length > 0 && (
          <div className="mt-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] block mb-2">
              Available Building Amenities:
            </span>
            <div className="flex flex-wrap gap-2">
              {node.facilities.map((fac, i) => (
                <span key={i} className="px-3 py-1 rounded-xl text-xs font-semibold bg-[#F3F0FF] text-[#635BFF] border border-[#E0DBFF]">
                  {fac}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Available Rooms Directory in This Building */}
      <section className="bg-white rounded-3xl border border-[#E8EAF2] p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#635BFF]" />
              <span>Rooms & Department Directory ({buildingRooms.length})</span>
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Verified classrooms, seminar halls, and faculty cabins inside this block.
            </p>
          </div>
        </div>

        {buildingRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {buildingRooms.map(rm => (
              <div
                key={rm.id}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-[#C7BDFF] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold font-mono text-[#635BFF] bg-white px-2 py-0.5 rounded-md border border-[#E8EAF2]">
                      Room {rm.roomNumber}
                    </span>
                    <span className="text-[11px] font-semibold text-[#64748B]">
                      {rm.floorName}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#0F172A]">
                    {rm.name}
                  </h4>
                  <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                    {rm.description}
                  </p>
                  <p className="text-xs text-purple-800 bg-purple-50 p-2 rounded-xl mt-2 italic">
                    📍 {rm.indoorDirections}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[11px] text-[#94A3B8]">
                    Near: {rm.landmarkNearRoom}
                  </span>
                  <button
                    onClick={() => navigate(`/map?dest=${node.id}&room=${rm.id}`)}
                    className="px-2.5 py-1 bg-[#635BFF] text-white rounded-lg text-xs font-semibold hover:bg-[#5145E5] transition-colors"
                  >
                    Navigate to Room
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-[#94A3B8] bg-slate-50 rounded-2xl">
            No specific sub-rooms are listed for this waypoint. Navigate directly to the main entrance.
          </div>
        )}
      </section>

      {/* Community Posts Related to This Location */}
      <section className="bg-white rounded-3xl border border-[#E8EAF2] p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#635BFF]" />
              <span>Campus Connect Posts for {node.name}</span>
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Lost items, tips, and student discussions tagged with this building.
            </p>
          </div>
          <Link
            to="/community"
            className="text-xs font-semibold text-[#635BFF] hover:underline"
          >
            View All in Community →
          </Link>
        </div>

        {communityPosts.length > 0 ? (
          <div className="space-y-3">
            {communityPosts.map(post => (
              <div
                key={post.id}
                onClick={() => navigate(`/community/${post.id}`)}
                className="p-4 bg-slate-50 hover:bg-[#FAF9FF] rounded-2xl border border-slate-200 hover:border-[#C7BDFF] transition-all cursor-pointer flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-[#635BFF] border border-[#E8EAF2]">
                      {post.category}
                    </span>
                    <span className="text-xs font-semibold text-[#0F172A]">{post.author}</span>
                    <span className="text-xs text-[#94A3B8]">• {post.timestamp}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#0F172A]">{post.title}</h4>
                  <p className="text-xs text-[#64748B] mt-1 line-clamp-1">{post.body}</p>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#64748B] flex-shrink-0">
                  <span className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" /> {post.upvotes}</span>
                  <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {post.comments.length}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-[#94A3B8] bg-slate-50 rounded-2xl">
            No community posts have been tagged with this building yet. Be the first to share a tip!
          </div>
        )}
      </section>

    </div>
  );
}
