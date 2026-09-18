import React, { useState } from 'react';
import { 
  User, 
  Gamepad2, 
  Clock, 
  Gift, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink,
  Sparkles,
  Award,
  Settings,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useRouter } from '../context/RouterContext';
import { SAMPLE_ORDERS, GAMES } from '../data/mockData';

export const DashboardPage: React.FC = () => {
  const { user, addSavedAccount, removeSavedAccount, logout } = useAuth();
  const { formatPrice } = useCurrency();
  const { navigate } = useRouter();

  const [activeTab, setActiveTab] = useState<'accounts' | 'orders' | 'rewards' | 'settings'>('accounts');

  // Add Account Modal
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [newNickname, setNewNickname] = useState('');
  const [newGameId, setNewGameId] = useState(GAMES[0].slug);
  const [newUserId, setNewUserId] = useState('');
  const [newServerId, setNewServerId] = useState('');

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <User className="w-12 h-12 text-brand-gold mx-auto" />
        <h2 className="text-2xl font-display font-black text-white">Please Sign In</h2>
        <p className="text-xs text-gray-400">Log in to view your saved gamer accounts, past orders, and rewards.</p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-3 bg-brand-gold text-brand-dark font-extrabold text-xs uppercase rounded-xl shadow-gold-glow"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNickname || !newUserId) return;

    const gameObj = GAMES.find(g => g.slug === newGameId);

    addSavedAccount({
      nickname: newNickname,
      gameId: newGameId,
      gameName: gameObj?.name || 'Mobile Game',
      userId: newUserId,
      serverId: newServerId || undefined
    });

    setNewNickname('');
    setNewUserId('');
    setNewServerId('');
    setIsAddAccountModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Profile Overview Header Card */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#21163B] via-[#141026] to-[#21163B] border border-brand-gold/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-brand-gold shadow-gold-glow"
            />
            <div className="absolute -bottom-1 -right-1 bg-brand-gold text-brand-dark font-black text-[10px] px-2 py-0.5 rounded-full border border-brand-dark shadow">
              VIP
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-display font-black text-white">{user.name}</h1>
              <span className="text-[10px] font-extrabold text-brand-gold bg-brand-gold/15 px-2.5 py-0.5 rounded-full border border-brand-gold/30 uppercase">
                {user.vipTier}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
            <div className="flex items-center gap-4 text-xs text-gray-300 mt-2">
              <span>Loyalty Balance: <strong className="text-brand-gold font-bold">{user.loyaltyPoints.toLocaleString()} GPDS pts</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => navigate('/games')}
            className="flex-1 md:flex-none px-5 py-3 rounded-xl bg-gradient-to-r from-brand-gold to-brand-goldLight text-brand-dark font-display font-black text-xs uppercase tracking-wider shadow-gold-glow"
          >
            Quick Top-Up
          </button>
          <button
            onClick={() => logout()}
            className="px-4 py-3 rounded-xl bg-brand-card hover:bg-red-500/10 border border-brand-cardBorder hover:border-red-500/40 text-red-400 text-xs font-bold uppercase transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-brand-cardBorder scrollbar-none">
        {[
          { id: 'accounts', label: 'Saved Game IDs', icon: Gamepad2, count: user.savedAccounts.length },
          { id: 'orders', label: 'Order History', icon: Clock, count: SAMPLE_ORDERS.length },
          { id: 'rewards', label: 'Points & Rewards', icon: Gift },
          { id: 'settings', label: 'Account Security', icon: Settings },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-brand-gold text-brand-dark shadow-gold-glow'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-brand-dark/30 text-brand-dark' : 'bg-brand-card text-gray-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: SAVED GAME ACCOUNTS */}
      {activeTab === 'accounts' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-display font-bold text-white">Your Saved Game UIDs</h2>
              <p className="text-xs text-gray-400">Autofill your UID and Server ID automatically with one click when topping up.</p>
            </div>
            <button
              onClick={() => setIsAddAccountModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-brand-card hover:bg-brand-cardLight border border-brand-gold/40 text-brand-gold font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Game ID
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.savedAccounts.map(acc => (
              <div
                key={acc.id}
                className="p-5 rounded-3xl bg-brand-card border border-brand-cardBorder hover:border-brand-gold/40 transition-all space-y-3 relative group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-brand-gold uppercase">{acc.gameName}</span>
                    <h3 className="text-base font-display font-bold text-white">{acc.nickname}</h3>
                  </div>
                  <button
                    onClick={() => removeSavedAccount(acc.id)}
                    className="text-gray-500 hover:text-red-400 transition-colors p-1"
                    title="Remove saved ID"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-[#0E0A1C] border border-brand-cardBorder text-xs space-y-1">
                  <div className="flex justify-between text-gray-400">
                    <span>User ID (UID):</span>
                    <span className="font-mono font-bold text-white">{acc.userId}</span>
                  </div>
                  {acc.serverId && (
                    <div className="flex justify-between text-gray-400">
                      <span>Server / Zone:</span>
                      <span className="font-mono font-bold text-white">{acc.serverId}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => navigate(`/games/${acc.gameId}`)}
                  className="w-full py-2 bg-brand-gold/15 hover:bg-brand-gold text-brand-gold hover:text-brand-dark font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all"
                >
                  Top Up This Account
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ORDER HISTORY */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-display font-bold text-white">Transaction & Order History</h2>
              <p className="text-xs text-gray-400">Review all your previous game currency purchases and instant delivery status.</p>
            </div>
          </div>

          <div className="space-y-3">
            {SAMPLE_ORDERS.map(order => (
              <div
                key={order.id}
                className="p-5 rounded-2xl bg-brand-card border border-brand-cardBorder flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img src={order.gameIcon} alt={order.gameName} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-sm">{order.orderNumber}</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.2 rounded-full border ${
                        order.status === 'COMPLETED'
                          ? 'bg-green-500/15 text-green-400 border-green-500/30'
                          : 'bg-brand-gold/15 text-brand-gold border-brand-gold/30'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {order.gameName} • <strong className="text-brand-gold">{order.itemName}</strong> (UID: {order.userId})
                    </p>
                    <span className="text-[11px] text-gray-500 font-mono">{order.createdAt}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full md:w-auto gap-6">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-gray-400 uppercase block font-semibold">Total Paid</span>
                    <span className="text-base font-display font-black text-brand-gold">
                      {formatPrice(order.totalPhp)}
                    </span>
                  </div>

                  <button
                    onClick={() => navigate('/payment')}
                    className="px-4 py-2 rounded-xl bg-[#0E0A1C] hover:bg-white/10 border border-brand-cardBorder text-xs font-bold text-white transition-colors"
                  >
                    View Receipt
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: REWARDS */}
      {activeTab === 'rewards' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-brand-card border border-brand-cardBorder flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-brand-gold uppercase">Your GPDS Points</span>
              <div className="text-3xl font-display font-black text-white mt-1">
                {user.loyaltyPoints.toLocaleString()} <span className="text-brand-gold">PTS</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Earn 1 point for every ₱10 spent on top-ups.</p>
            </div>

            <div className="text-xs text-green-400 bg-green-500/10 px-3 py-1.5 rounded-xl border border-green-500/20 font-semibold">
              VIP Tier Active: 1.5x Points Multiplier
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { reward: '₱50 Off Voucher', points: 500, code: 'REWARD50' },
              { reward: '₱120 Off Voucher', points: 1000, code: 'REWARD120' },
              { reward: '₱300 Off Voucher', points: 2500, code: 'REWARD300' },
            ].map(r => (
              <div key={r.code} className="p-5 rounded-2xl bg-brand-card border border-brand-cardBorder space-y-3 text-center">
                <Gift className="w-8 h-8 text-brand-gold mx-auto" />
                <h4 className="font-display font-bold text-white text-base">{r.reward}</h4>
                <div className="text-xs text-brand-cyan font-bold">{r.points} Points Needed</div>
                <button
                  disabled={user.loyaltyPoints < r.points}
                  className="w-full py-2 bg-brand-gold text-brand-dark font-extrabold text-xs uppercase rounded-xl disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {user.loyaltyPoints >= r.points ? 'Redeem Voucher' : 'Not Enough Points'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="max-w-xl p-6 rounded-3xl bg-brand-card border border-brand-cardBorder space-y-4 text-xs">
          <h3 className="font-display font-bold text-base text-white">Account Information</h3>
          <div className="space-y-3">
            <div>
              <label className="text-gray-400 block mb-1">Display Nickname</label>
              <input type="text" defaultValue={user.name} className="w-full bg-[#0E0A1C] border border-brand-cardBorder rounded-xl p-3 text-white outline-none" />
            </div>
            <div>
              <label className="text-gray-400 block mb-1">Email Address</label>
              <input type="email" defaultValue={user.email} className="w-full bg-[#0E0A1C] border border-brand-cardBorder rounded-xl p-3 text-white outline-none" />
            </div>
            <button className="px-5 py-2.5 bg-brand-gold text-brand-dark font-bold rounded-xl uppercase">
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Add Account Modal */}
      {isAddAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#151125] border border-brand-gold/40 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-brand-cardBorder">
              <h3 className="font-display font-bold text-lg text-white">Add Saved Game ID</h3>
              <button onClick={() => setIsAddAccountModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-300 block mb-1">Account Label / Nickname</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My MLBB Main"
                  value={newNickname}
                  onChange={e => setNewNickname(e.target.value)}
                  className="w-full bg-[#0E0A1C] border border-brand-cardBorder rounded-xl p-3 text-white outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-300 block mb-1">Select Game</label>
                <select
                  value={newGameId}
                  onChange={e => setNewGameId(e.target.value)}
                  className="w-full bg-[#0E0A1C] border border-brand-cardBorder rounded-xl p-3 text-white outline-none cursor-pointer"
                >
                  {GAMES.map(g => (
                    <option key={g.id} value={g.slug}>{g.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-300 block mb-1">User ID (UID)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 123456789"
                  value={newUserId}
                  onChange={e => setNewUserId(e.target.value)}
                  className="w-full bg-[#0E0A1C] border border-brand-cardBorder rounded-xl p-3 text-white font-mono outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-300 block mb-1">Server ID / Zone ID (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 3209"
                  value={newServerId}
                  onChange={e => setNewServerId(e.target.value)}
                  className="w-full bg-[#0E0A1C] border border-brand-cardBorder rounded-xl p-3 text-white font-mono outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-gold text-brand-dark font-display font-black text-xs uppercase tracking-wider rounded-xl shadow-gold-glow"
              >
                Save Account
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
