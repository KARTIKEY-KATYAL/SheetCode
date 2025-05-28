import React, { useEffect, useState, useRef } from 'react';
import { useAuthStore } from "../store/useAuthStore";
import { usePlaylistStore } from '../store/usePlaylistStore';
import { useProblemStore } from "../store/useProblemStore";
import { Link } from "react-router-dom";
import { 
  UserCircle, 
  Mail, 
  Calendar, 
  Award, 
  CheckCircle, 
  FileText, 
  ChevronRight,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  Code,
  BookOpen,
  BarChart2,
  Search,
  Filter,
  PlusCircle,
  Loader,
  Clock,
  Edit3,
  Camera,
  X,
  Save,
  Trophy,
  Shield,
  Medal
} from 'lucide-react';
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

function Profile() {
  const { authUser, updateProfile } = useAuthStore();
  const { playlists, getAllPlaylists, isLoading: isPlaylistsLoading } = usePlaylistStore();
  const { solvedProblems, getSolvedProblemByUser, isProblemsLoading } = useProblemStore();
  const [activeTab, setActiveTab] = useState('problems');
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');
  
  // Profile edit state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    githubUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
    bio: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form when modal opens
  useEffect(() => {
    if (isEditModalOpen && authUser) {
      setEditForm({
        name: authUser.name || '',
        email: authUser.email || '',
        githubUrl: authUser.githubUrl || '',
        linkedinUrl: authUser.linkedinUrl || '',
        twitterUrl: authUser.twitterUrl || '',
        bio: authUser.bio || ''
      });
      setAvatarPreview(authUser.avatar || null);
    }
  }, [isEditModalOpen, authUser]);

  // Handle avatar file change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create form data for multipart upload
      const formData = new FormData();
      
      // Add basic fields
      formData.append('name', editForm.name);
      formData.append('email', editForm.email);
      formData.append('bio', editForm.bio);
      
      // Add social links
      formData.append('githubUrl', editForm.githubUrl);
      formData.append('linkedinUrl', editForm.linkedinUrl);
      formData.append('twitterUrl', editForm.twitterUrl);
      
      // Add avatar if changed
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }
      
      // Call the update API
      await axiosInstance.patch('/auth/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Update local state with Zustand
      updateProfile({
        ...authUser,
        name: editForm.name,
        email: editForm.email,
        bio: editForm.bio,
        githubUrl: editForm.githubUrl,
        linkedinUrl: editForm.linkedinUrl,
        twitterUrl: editForm.twitterUrl,
        // Avatar will be updated through the full auth refresh
      });
      
      toast.success('Profile updated successfully!');
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error?.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch user data
  useEffect(() => {
    if (authUser) {
      getSolvedProblemByUser();
      getAllPlaylists();
    }
  }, [authUser, getSolvedProblemByUser, getAllPlaylists]);

  // Calculate stats
  const stats = {
    totalSolved: solvedProblems?.length || 0,
    easy: solvedProblems?.filter(p => p.problem?.difficulty === 'EASY')?.length || 0,
    medium: solvedProblems?.filter(p => p.problem?.difficulty === 'MEDIUM')?.length || 0,
    hard: solvedProblems?.filter(p => p.problem?.difficulty === 'HARD')?.length || 0,
    sheetsCreated: playlists?.length || 0,
    totalProblemsInSheets: playlists?.reduce((acc, curr) => acc + (curr.problems?.length || 0), 0) || 0
  };

  // Filter problems based on search and difficulty
  const filteredProblems = React.useMemo(() => {
    if (!solvedProblems) return [];
    
    return solvedProblems.filter(item => {
      const matchesSearch = !searchQuery || 
        item.problem?.title?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDifficulty = difficultyFilter === 'ALL' || 
        item.problem?.difficulty === difficultyFilter;
      
      return matchesSearch && matchesDifficulty;
    });
  }, [solvedProblems, searchQuery, difficultyFilter]);

  if (!authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="text-center p-8 rounded-2xl shadow-2xl bg-white dark:bg-gray-800 border-t-4 border-red-500">
          <UserCircle className="w-20 h-20 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Please log in to view your profile
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Track your progress and manage your problem sheets after logging in
          </p>
          <Link 
            to="/login" 
            className="btn bg-gradient-to-r from-red-500 to-blue-600 hover:from-red-600 hover:to-blue-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg transition-all hover:shadow-xl"
          >
            Log In to Continue
          </Link>
        </div>
      </div>
    );
  }

  // Social link rendering helper
  const renderSocialLink = (url, Icon) => {
    if (!url) return null;
    
    return (
      <a 
        href={url.startsWith('http') ? url : `https://${url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all hover:scale-110"
      >
        <Icon className="w-5 h-5 text-white" />
      </a>
    );
  };

  // League styling helpers
  const getLeagueColor = (league) => {
    switch(league) {
      case 'BRONZE': return 'from-amber-700 to-amber-500';
      case 'SILVER': return 'from-gray-400 to-gray-300';
      case 'GOLD': return 'from-yellow-500 to-yellow-300';
      case 'PLATINUM': return 'from-cyan-500 to-blue-400';
      default: return 'from-amber-700 to-amber-500';
    }
  };
  
  const getLeagueIcon = (league) => {
    switch(league) {
      case 'BRONZE': return <Shield className="w-5 h-5" />;
      case 'SILVER': return <Shield className="w-5 h-5" />;
      case 'GOLD': return <Medal className="w-5 h-5" />;
      case 'PLATINUM': return <Trophy className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  // Add this to determine next league requirements
  const getNextLeagueProgress = (league, solvedCount) => {
    switch(league) {
      case 'BRONZE': return { next: 'SILVER', current: solvedCount, required: 100, progress: (solvedCount/100) * 100 };
      case 'SILVER': return { next: 'GOLD', current: solvedCount, required: 700, progress: ((solvedCount-100)/600) * 100 };
      case 'GOLD': return { next: 'PLATINUM', current: solvedCount, required: 1000, progress: ((solvedCount-700)/300) * 100 };
      case 'PLATINUM': return { next: null, current: solvedCount, required: null, progress: 100 };
      default: return { next: 'SILVER', current: solvedCount, required: 100, progress: (solvedCount/100) * 100 };
    }
  };
  
  // Calculate next league progress
  const nextLeagueInfo = getNextLeagueProgress(authUser?.league || 'BRONZE', stats.totalSolved);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-black dark:text-white">
      {/* Hero Banner with Personal Details */}
      <section className="relative overflow-hidden">
        {/* Updated Background with red-blue-black theme */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-red-900 to-blue-900 overflow-hidden">
          {/* Animated overlay pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-transparent to-blue-600/20"></div>
          <div className="absolute -inset-[10px] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCAzLjk4LTEuNzggNC00ek02MCAxMmMwIDYuNjQtNS4zOCAxMi0xMiAxMi02LjY0IDAtMTItNS4zNi0xMi0xMkMzNiA1LjM2IDQxLjM2IDAgNDggMGM2LjYyIDAgMTIgNS4zNiAxMiAxMnptLTI0IDZjMC00LjQyLTMuNTgtOC04LThzLTggMy41OC04IDggMy41OCA4IDggOGM0LjQyIDAgOC0zLjU4IDgtOHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10 animate-[spin_80s_linear_infinite]"></div>
          {/* Additional geometric overlay */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tl from-black/30 via-transparent to-red-600/20"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 py-12 px-4">
            {/* Avatar Section - Updated to show edit button */}
            <div className="relative group">
              <div className="w-36 h-36 rounded-full bg-white dark:bg-gray-800 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
                {authUser.avatar ? (
                  <img 
                    src={authUser.avatar} 
                    alt={`${authUser.name}'s profile`}
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <UserCircle className="w-32 h-32 text-gray-400" />
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1 border-2 border-white">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 opacity-0 group-hover:opacity-100 transition-opacity rounded-full p-2 shadow-md border-2 border-white"
                title="Edit Profile"
              >
                <Edit3 className="w-4 h-4 text-white" />
              </button>
            </div>
            
            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-3xl md:text-4xl font-extrabold text-white">
                  {authUser.name}
                </h1>
                
                {/* League Badge */}
                <div className={`bg-gradient-to-r ${getLeagueColor(authUser?.league || 'BRONZE')} ml-2 px-3 py-1 rounded-full text-white text-sm font-bold flex items-center gap-2 shadow-lg`}>
                  {getLeagueIcon(authUser?.league || 'BRONZE')}
                  {authUser?.league || 'BRONZE'} League
                </div>
                
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  title="Edit Profile"
                >
                  <Edit3 className="w-4 h-4 text-white" />
                </button>
              </div>
              <p className="text-lg text-white/80 font-medium">@{authUser.username || authUser.name?.toLowerCase().replace(/\s/g, '')}</p>
              
              {authUser.bio && (
                <p className="mt-2 text-white/90 max-w-xl">
                  {authUser.bio}
                </p>
              )}
              
              <div className="mt-4 flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full text-white">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{authUser.email}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full text-white">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Joined {new Date(authUser.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full text-white">
                  <Award className="w-4 h-4" />
                  <span className="text-sm uppercase">{authUser.role}</span>
                </div>
              </div>
              
              <div className="mt-6 flex gap-4 justify-center md:justify-start">
                {/* Social links - Conditionally rendered based on user data */}
                {renderSocialLink(authUser.githubUrl, Github)}
                {renderSocialLink(authUser.linkedinUrl, Linkedin)}
                {renderSocialLink(authUser.twitterUrl, Twitter)}
                
                {/* Show edit button if no social links */}
                {!authUser.githubUrl && !authUser.linkedinUrl && !authUser.twitterUrl && (
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all flex items-center gap-2 text-sm"
                  >
                    <PlusCircle className="w-4 h-4 text-white" />
                    <span className="text-white font-medium">Add social links</span>
                  </button>
                )}
              </div>
            </div>
            
            {/* Stats Cards - Desktop */}
            <div className="hidden md:flex flex-col gap-4 min-w-[260px] backdrop-blur-md bg-black/20 border border-red-500/30 p-6 rounded-2xl shadow-xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-red-600/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
                  <div className="text-3xl font-bold text-white">{stats.totalSolved}</div>
                  <div className="text-sm text-white/80 font-medium">Problems Solved</div>
                </div>
                <div className="text-center p-3 bg-blue-600/20 border border-blue-500/30 rounded-xl backdrop-blur-sm">
                  <div className="text-3xl font-bold text-white">{stats.sheetsCreated}</div>
                  <div className="text-sm text-white/80 font-medium">Study Sheets</div>
                </div>
              </div>
              
              <div className="w-full bg-black/30 border border-gray-500/30 h-2 rounded-full mt-2">
                {stats.totalSolved > 0 && (
                  <div className="flex h-full rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-400" 
                      style={{width: `${(stats.easy / stats.totalSolved) * 100}%`}}
                    ></div>
                    <div 
                      className="bg-gradient-to-r from-yellow-500 to-orange-400" 
                      style={{width: `${(stats.medium / stats.totalSolved) * 100}%`}}
                    ></div>
                    <div 
                      className="bg-gradient-to-r from-red-500 to-red-400" 
                      style={{width: `${(stats.hard / stats.totalSolved) * 100}%`}}
                    ></div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between text-xs text-white/80">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Easy: {stats.easy}
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                  Medium: {stats.medium}
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                  Hard: {stats.hard}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave Divider - Updated color */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" className="fill-slate-100 dark:fill-slate-900 w-full h-16">
            <path d="M0,64L80,64C160,64,320,64,480,53.3C640,43,800,21,960,16C1120,11,1280,21,1360,26.7L1440,32L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Stats Cards - Mobile */}
      <div className="md:hidden grid grid-cols-3 gap-3 mx-4 -mt-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalSolved}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg text-center">
          <div className="flex justify-center gap-1">
            <span className="text-green-500 font-bold text-xl">{stats.easy}</span>
            <span className="text-yellow-500 font-bold text-xl">{stats.medium}</span>
            <span className="text-red-500 font-bold text-xl">{stats.hard}</span>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">E / M / H</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.sheetsCreated}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Sheets</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Tabs Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
          <button
            className={`flex items-center gap-2 py-3 px-6 font-medium text-lg transition-all relative ${
              activeTab === 'problems'
                ? 'text-red-600 dark:text-red-400 border-b-2 border-red-600 dark:border-red-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
            }`}
            onClick={() => setActiveTab('problems')}
          >
            <Code className="w-5 h-5" />
            Solved Problems
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {stats.totalSolved}
            </span>
          </button>
          <button
            className={`flex items-center gap-2 py-3 px-6 font-medium text-lg transition-all relative ${
              activeTab === 'sheets'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
            onClick={() => setActiveTab('sheets')}
          >
            <BookOpen className="w-5 h-5" />
            My Study Sheets
            <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {stats.sheetsCreated}
            </span>
          </button>
          <button
            className={`flex items-center gap-2 py-3 px-6 font-medium text-lg transition-all ${
              activeTab === 'stats'
                ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
            }`}
            onClick={() => setActiveTab('stats')}
          >
            <BarChart2 className="w-5 h-5" />
            Statistics
          </button>
        </div>

        {/* Dynamic Content Based on Tab */}
        {activeTab === 'problems' && (
          <div className="fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-black dark:text-white flex items-center">
                <CheckCircle className="w-6 h-6 mr-2 text-green-500" /> 
                Solved Problems
              </h2>
              
              <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search problems..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full md:w-64 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  />
                </div>
                
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none appearance-none cursor-pointer"
                >
                  <option value="ALL">All Difficulties</option>
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>
            </div>
            
            {isProblemsLoading ? (
              <div className="flex justify-center items-center py-16">
                <Loader className="w-8 h-8 text-red-500 animate-spin" />
                <span className="ml-3 text-lg font-medium">Loading your solved problems...</span>
              </div>
            ) : filteredProblems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProblems.map((item) => (
                  <div 
                    key={item.id} 
                    className="group bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-500 transition-all hover:shadow-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`inline-block w-3 h-3 rounded-full ${
                            item.problem?.difficulty === 'EASY' 
                              ? 'bg-green-500' 
                              : item.problem?.difficulty === 'MEDIUM'
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                          }`}></span>
                          
                          <h3 className="font-bold text-lg">
                            <Link 
                              to={`/problem/${item.problemId}`} 
                              className="text-gray-900 dark:text-gray-100 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            >
                              {item.problem?.title || "Problem"}
                            </Link>
                          </h3>
                        </div>
                        
                        <div className="flex gap-2 mt-2">
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                            item.problem?.difficulty === 'EASY' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : item.problem?.difficulty === 'MEDIUM'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {item.problem?.difficulty}
                          </span>
                          
                          {item.problem?.tags?.slice(0, 2).map((tag, i) => (
                            <span key={i} className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-md">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <Link 
                        to={`/problem/${item.problemId}`} 
                        className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4 mr-1" />
                      Solved on {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md text-center border border-dashed border-gray-300 dark:border-gray-700">
                {searchQuery || difficultyFilter !== 'ALL' ? (
                  <>
                    <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-medium mb-2">No matching problems found</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Try adjusting your search or filter criteria
                    </p>
                    <button 
                      onClick={() => {setSearchQuery(''); setDifficultyFilter('ALL');}}
                      className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      <Filter className="w-4 h-4" />
                      Clear Filters
                    </button>
                  </>
                ) : (
                  <>
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-medium mb-2">No solved problems yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Start solving problems to build your portfolio
                    </p>
                    <Link 
                      to="/problems" 
                      className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      <Code className="w-4 h-4" />
                      Explore Problems
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'sheets' && (
          <div className="fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-black dark:text-white flex items-center">
                <BookOpen className="w-6 h-6 mr-2 text-blue-500" />
                My Study Sheets
              </h2>
              
              <Link 
                to="/problems" 
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors shadow-md"
              >
                <PlusCircle className="w-4 h-4" />
                Create New Sheet
              </Link>
            </div>
            
            {isPlaylistsLoading ? (
              <div className="flex justify-center items-center py-16">
                <Loader className="w-8 h-8 text-blue-500 animate-spin" />
                <span className="ml-3 text-lg font-medium">Loading your study sheets...</span>
              </div>
            ) : playlists && playlists.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {playlists.map((playlist) => (
                  <div 
                    key={playlist.id} 
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-lg overflow-hidden"
                  >
                    <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                      <div className="absolute bottom-0 right-0 bg-blue-700 text-white px-3 py-1 text-sm font-semibold rounded-tl-lg">
                        {playlist.problems?.length || 0} Problems
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100">
                          <Link 
                            to={`/playlist/${playlist.id}`} 
                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            {playlist.title}
                          </Link>
                        </h3>
                        
                        <Link 
                          to={`/playlist/${playlist.id}`} 
                          className="p-2 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </Link>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                        {playlist.description || "No description available"}
                      </p>
                      
                      {/* First 3 problem tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {playlist.problems?.slice(0, 3).map((problem, idx) => (
                          <span key={idx} className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded-md">
                            {problem.title?.substring(0, 15)}{problem.title?.length > 15 ? "..." : ""}
                          </span>
                        ))}
                        {playlist.problems?.length > 3 && (
                          <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-md">
                            +{playlist.problems.length - 3} more
                          </span>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Created on {new Date(playlist.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md text-center border border-dashed border-gray-300 dark:border-gray-700">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-medium mb-2">No study sheets created yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Create your first sheet to organize problems by topics
                </p>
                <Link 
                  to="/problems" 
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  Create Your First Sheet
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="fade-in">
            <h2 className="text-2xl font-bold mb-6 text-black dark:text-white flex items-center">
              <BarChart2 className="w-6 h-6 mr-2 text-purple-500" />
              Problem Solving Statistics
            </h2>
            
            {/* Add this League Progression Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  League Status
                </h3>
                <div className={`bg-gradient-to-r ${getLeagueColor(authUser?.league || 'BRONZE')} px-4 py-1.5 rounded-full text-white font-bold flex items-center gap-2`}>
                  {getLeagueIcon(authUser?.league || 'BRONZE')}
                  {authUser?.league || 'BRONZE'}
                </div>
              </div>
              
              {nextLeagueInfo.next ? (
                <>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Progress to {nextLeagueInfo.next} League
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {nextLeagueInfo.current} / {nextLeagueInfo.required} problems
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
                    <div 
                      className={`bg-gradient-to-r ${getLeagueColor(nextLeagueInfo.next)} h-3 rounded-full transition-all duration-1000`} 
                      style={{width: `${Math.min(100, nextLeagueInfo.progress)}%`}}
                    ></div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Solve <strong>{nextLeagueInfo.required - nextLeagueInfo.current}</strong> more problems to reach {nextLeagueInfo.next} League!
                  </p>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full mb-4">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Maximum League Reached!</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Congratulations! You've reached the highest league by solving {nextLeagueInfo.current} problems.
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
                <div className={`p-4 rounded-lg ${authUser?.league === 'BRONZE' || authUser?.league === 'SILVER' || authUser?.league === 'GOLD' || authUser?.league === 'PLATINUM' ? 'bg-amber-100 dark:bg-amber-900/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
                  <div className="flex items-center mb-2">
                    <Shield className={`w-5 h-5 ${authUser?.league === 'BRONZE' || authUser?.league === 'SILVER' || authUser?.league === 'GOLD' || authUser?.league === 'PLATINUM' ? 'text-amber-700' : 'text-gray-400'} mr-2`} />
                    <span className={`font-medium ${authUser?.league === 'BRONZE' || authUser?.league === 'SILVER' || authUser?.league === 'GOLD' || authUser?.league === 'PLATINUM' ? 'text-amber-800 dark:text-amber-300' : 'text-gray-500 dark:text-gray-400'}`}>Bronze</span>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">0-99 problems</span>
                </div>
                
                <div className={`p-4 rounded-lg ${authUser?.league === 'SILVER' || authUser?.league === 'GOLD' || authUser?.league === 'PLATINUM' ? 'bg-gray-100 dark:bg-gray-700/40' : 'bg-gray-100 dark:bg-gray-800'}`}>
                  <div className="flex items-center mb-2">
                    <Shield className={`w-5 h-5 ${authUser?.league === 'SILVER' || authUser?.league === 'GOLD' || authUser?.league === 'PLATINUM' ? 'text-gray-500' : 'text-gray-400'} mr-2`} />
                    <span className={`font-medium ${authUser?.league === 'SILVER' || authUser?.league === 'GOLD' || authUser?.league === 'PLATINUM' ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>Silver</span>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">100-699 problems</span>
                </div>
                
                <div className={`p-4 rounded-lg ${authUser?.league === 'GOLD' || authUser?.league === 'PLATINUM' ? 'bg-yellow-100 dark:bg-yellow-900/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
                  <div className="flex items-center mb-2">
                    <Medal className={`w-5 h-5 ${authUser?.league === 'GOLD' || authUser?.league === 'PLATINUM' ? 'text-yellow-500' : 'text-gray-400'} mr-2`} />
                    <span className={`font-medium ${authUser?.league === 'GOLD' || authUser?.league === 'PLATINUM' ? 'text-yellow-700 dark:text-yellow-300' : 'text-gray-500 dark:text-gray-400'}`}>Gold</span>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">700-999 problems</span>
                </div>
                
                <div className={`p-4 rounded-lg ${authUser?.league === 'PLATINUM' ? 'bg-cyan-100 dark:bg-cyan-900/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
                  <div className="flex items-center mb-2">
                    <Trophy className={`w-5 h-5 ${authUser?.league === 'PLATINUM' ? 'text-cyan-500' : 'text-gray-400'} mr-2`} />
                    <span className={`font-medium ${authUser?.league === 'PLATINUM' ? 'text-cyan-700 dark:text-cyan-300' : 'text-gray-500 dark:text-gray-400'}`}>Platinum</span>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">1000+ problems</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Difficulty Distribution Card */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Difficulty Distribution</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-green-600 dark:text-green-400 font-medium">Easy</span>
                      <span className="text-gray-600 dark:text-gray-400">{stats.easy} problems ({stats.totalSolved > 0 ? Math.round((stats.easy/stats.totalSolved)*100) : 0}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-green-500 h-2.5 rounded-full" 
                        style={{width: `${stats.totalSolved > 0 ? (stats.easy/stats.totalSolved)*100 : 0}%`}}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-yellow-600 dark:text-yellow-400 font-medium">Medium</span>
                      <span className="text-gray-600 dark:text-gray-400">{stats.medium} problems ({stats.totalSolved > 0 ? Math.round((stats.medium/stats.totalSolved)*100) : 0}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-yellow-500 h-2.5 rounded-full" 
                        style={{width: `${stats.totalSolved > 0 ? (stats.medium/stats.totalSolved)*100 : 0}%`}}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-red-600 dark:text-red-400 font-medium">Hard</span>
                      <span className="text-gray-600 dark:text-gray-400">{stats.hard} problems ({stats.totalSolved > 0 ? Math.round((stats.hard/stats.totalSolved)*100) : 0}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-red-500 h-2.5 rounded-full" 
                        style={{width: `${stats.totalSolved > 0 ? (stats.hard/stats.totalSolved)*100 : 0}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h4 className="font-medium text-purple-700 dark:text-purple-400 mb-1">Did you know?</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Most interviews focus on medium difficulty problems. Try to keep a balanced problem-solving approach!
                  </p>
                </div>
              </div>
              
              {/* Activity Stats Card */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Your Activity</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.totalSolved}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Problems Solved</div>
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.totalProblemsInSheets}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Problems In Sheets</div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress to Next Level</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{Math.min(100, Math.round((stats.totalSolved/100)*100))}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full" 
                      style={{width: `${Math.min(100, (stats.totalSolved/100)*100)}%`}}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Solve {Math.max(0, 100 - stats.totalSolved)} more problems to reach the next level
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Recommended Next Steps</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-purple-500 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3">
                    <Code className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h4 className="font-medium mb-1 text-gray-900 dark:text-gray-100">Solve More Problems</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Continue building your problem-solving skills with our extensive collection.
                  </p>
                  <Link 
                    to="/problems" 
                    className="text-sm text-purple-600 dark:text-purple-400 font-medium hover:underline"
                  >
                    Explore problems →
                  </Link>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-500 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
                    <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="font-medium mb-1 text-gray-900 dark:text-gray-100">Create Study Plan</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Organize problems into topic-specific study sheets for interview preparation.
                  </p>
                  <Link 
                    to="/problems" 
                    className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline"
                  >
                    Create a sheet →
                  </Link>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-red-500 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-3">
                    <BarChart2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <h4 className="font-medium mb-1 text-gray-900 dark:text-gray-100">Balance Your Skills</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Focus on {stats.easy < stats.medium ? 'easy' : stats.medium < stats.hard ? 'medium' : 'hard'} problems to maintain a balanced profile.
                  </p>
                  <Link 
                    to="/problems" 
                    className="text-sm text-red-600 dark:text-red-400 font-medium hover:underline"
                  >
                    Find problems →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/70 dark:bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Edit Profile</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)} 
                className="btn btn-ghost btn-sm btn-circle text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="p-6 h-[50vh] overflow-scroll space-y-4">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center mb-4">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center border-2 border-gray-300 dark:border-gray-600">
                    {avatarPreview ? (
                      <img 
                        src={avatarPreview} 
                        alt="Avatar preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserCircle className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 transition rounded-full p-2 shadow-md border-2 border-white dark:border-gray-800"
                    title="Change avatar"
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Click the camera icon to upload a new avatar
                </p>
              </div>
              
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    className="input bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md w-full focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:text-white"
                    placeholder="Your name"
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">Email</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    className="input bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md w-full focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:text-white"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">Bio</span>
                  </label>
                  <textarea
                    name="bio"
                    value={editForm.bio}
                    onChange={handleInputChange}
                    className="textarea bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md w-full h-24 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:text-white"
                    placeholder="Tell us about yourself"
                  />
                </div>
              </div>
              
              {/* Social Links */}
              <div className="space-y-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <Github className="w-4 h-4" /> Social Links
                </h4>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">GitHub URL</span>
                  </label>
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="githubUrl"
                      value={editForm.githubUrl}
                      onChange={handleInputChange}
                      className="input pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md w-full focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:text-white"
                      placeholder="https://github.com/yourusername"
                    />
                  </div>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">LinkedIn URL</span>
                  </label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="linkedinUrl"
                      value={editForm.linkedinUrl}
                      onChange={handleInputChange}
                      className="input pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md w-full focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:text-white"
                      placeholder="https://linkedin.com/in/yourusername"
                    />
                  </div>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">Twitter URL</span>
                  </label>
                  <div className="relative">
                    <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="twitterUrl"
                      value={editForm.twitterUrl}
                      onChange={handleInputChange}
                      className="input pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md w-full focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:text-white"
                      placeholder="https://x.com/yourusername"
                    />
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Profile;

// Add this CSS in your global CSS file
/*
.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1, transform: translateY(0); }
}
*/