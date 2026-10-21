import React from 'react';
import { Star, X, Building2, Layers, DoorOpen, ArrowRight } from 'lucide-react';

export default function FavoritesModal({
  isOpen,
  onClose,
  favorites = [],
  nodes = [],
  rooms = [],
  onSelectFavorite,
  onRemoveFavorite,
}) {
  if (!isOpen) return null;

  // Resolve favorite items
  const resolvedFavorites = favorites.map(favId => {
    if (favId.startsWith('room-')) {
      const rId = favId.replace('room-', '');
      const room = rooms.find(r => r.id === rId);
      if (room) {
        return {
          id: favId,
          type: 'room',
          title: `${room.roomNumber} - ${room.name}`,
          subtitle: `Block ${room.blockNumber} • ${room.floorName}`,
          nodeId: room.blockId,
          roomObj: room,
        };
      }
    } else {
      const node = nodes.find(n => n.id === favId);
      if (node) {
        return {
          id: favId,
          type: node.category,
          title: node.name,
          subtitle: `${node.zone} (${node.code})`,
          nodeId: node.id,
          nodeObj: node,
        };
      }
    }
    return null;
  }).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 bg-navy-950 text-white flex items-center justify-between border-b border-navy-800">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h3 className="font-extrabold text-base text-white">
              Saved Favorite Destinations
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 max-h-96 overflow-y-auto divide-y divide-slate-100">
          {resolvedFavorites.length > 0 ? (
            resolvedFavorites.map(item => (
              <div
                key={item.id}
                className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 px-2 rounded-xl transition-colors"
              >
                <div
                  onClick={() => {
                    onSelectFavorite(item);
                    onClose();
                  }}
                  className="flex-1 cursor-pointer flex items-center gap-3"
                >
                  <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                    {item.type === 'room' ? (
                      <Layers className="w-4 h-4" />
                    ) : item.type === 'gate' ? (
                      <DoorOpen className="w-4 h-4" />
                    ) : (
                      <Building2 className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                    <p className="text-[11px] text-slate-500">{item.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onRemoveFavorite(item.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg transition-colors"
                    title="Remove from favorites"
                  >
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </button>
                  <button
                    onClick={() => {
                      onSelectFavorite(item);
                      onClose();
                    }}
                    className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    title="Navigate now"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-400">
              <Star className="w-10 h-10 text-slate-200 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-600">No saved favorites yet</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                Click the star icon in search results or location cards to bookmark frequently visited campus rooms.
              </p>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-navy-900 text-white rounded-xl text-xs font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
