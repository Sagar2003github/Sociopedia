
import React, { useState, useEffect} from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Heart, MessageCircle } from 'lucide-react';
import axios from 'axios';

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  const navigate = useNavigate();
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const { userProfile, user } = useSelector(store => store.auth);
  const isLoggedInUserProfile = user?._id === userProfile?._id;
  
  useEffect(() => {
    const storedFollowStatus = JSON.parse(localStorage.getItem('followStatus')) || {};
    setIsFollowing(storedFollowStatus[userId] || false);
  }, [userId]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  }

  const handleFollow = async () => {
    try {
      const response = await axios.post(`http://localhost:4000/api/v1/user/followorunfollow/${userId}`);
      if (response.data.success) {
        const updatedStatus = !isFollowing;
        setIsFollowing(updatedStatus);

        // Update follow status in localStorage
        const storedFollowStatus = JSON.parse(localStorage.getItem('followStatus')) || {};
        storedFollowStatus[userId] = updatedStatus;
        localStorage.setItem('followStatus', JSON.stringify(storedFollowStatus));
      }
    } catch (error) {
      console.error('Error following/unfollowing:', error);
    }
  };
  const handleMessageClick = () => {
    navigate(`/chat`); // Navigate to the chat page with selected user ID
  };
  const navigateToPost = () => {
    navigate(`/`); // Navigate to the specific post
  };
  const displayedPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks;

  return (
    <div className='flex max-w-5xl justify-center mx-auto pl-10'>
      <div className='flex flex-col gap-20 p-8'>
        <div className='grid grid-cols-2'>
          <section className='flex items-center justify-center'>
          <Avatar className='h-32 w-32'>
              <AvatarImage src={userProfile?.profilePicture} alt="profilephoto" />
              <AvatarFallback>{userProfile?.username?.[0]}</AvatarFallback>
            </Avatar>

          </section>
          <section>
            <div className='flex flex-col gap-5'>
              <div className='flex items-center gap-2'>
                <span>{userProfile?.username}</span>
                {
                  isLoggedInUserProfile ? (
                    <>
                      <Link to="/account/edit">
        <Button 
          variant='secondary' 
          className='bg-[#FF4162] text-white hover:bg-[#20C997]/90 dark:bg-[#20C997] dark:text-slate-50 h-8'
        >
          Edit profile
        </Button>
      </Link>
      <Link to="/explore">
        <Button 
          variant='secondary' 
          className='bg-[#FF4162] text-white hover:bg-[#20C997]/90 dark:bg-[#20C997] dark:text-slate-50 h-8'
        >
          Make own Ads
        </Button>
      </Link>

                    </>
                  ) :  (
                    <>
                      <Button onClick={handleFollow} variant='secondary' className={`h-8 ${isFollowing ? 'text-red-500' : 'text-[#3BADF8]'} hover:text-[#3495d6]`} >
                        {isFollowing ? 'Unfollow' : 'Follow'}
                      </Button>
                      {isFollowing && (
                          <Button onClick={handleMessageClick} variant='secondary' className='bg-[#FF4162] text-white hover:bg-[#20C997]/90 dark:bg-[#20C997] dark:text-slate-50 h-8'>Message</Button>
                      )}
                    </>
                  )}
              </div>
              <div className='flex items-center gap-4'>
                <p><span className='font-semibold'>{userProfile?.posts.length} </span>Posts</p>
                <p><span className='font-semibold'>{userProfile?.followers.length} </span>Followers</p>
                <p><span className='font-semibold'>{userProfile?.following.length} </span>Following</p>
              </div>
              <div className='flex flex-col gap-1'>
                <span className='font-semibold'>{userProfile?.bio || 'bio here...'}</span>
                <a href="https://www.threads.net/?hl=en" target="_blank" rel="noopener noreferrer">
  <Badge className='w-fit' variant='secondary'>
    <AtSign /> 
    <span className='pl-1'>{userProfile?.username}</span> 
  </Badge>
</a>

                
              </div>
            </div>
          </section>
        </div>
        <div className='border-t border-t-gray-200'>
          <div className='flex items-center justify-center gap-10 text-sm'>
          <span
  className={`py-3 cursor-pointer ${activeTab === 'posts' ? 'font-bold text-orange-500' : 'text-gray-600'}`} // Change text color when active
  onClick={() => handleTabChange('posts')}
>
  POSTS
</span>
<span
  className={`py-3 cursor-pointer ${activeTab === 'saved' ? 'font-bold text-orange-500' : 'text-gray-600'}`} // Change text color when active
  onClick={() => handleTabChange('saved')}
>
  SAVED
</span>

          </div>
          <div className='grid grid-cols-3 gap-1'   >
            {
              displayedPost?.map((post) => {
                return (
                  <div key={post?._id} className='relative group cursor-pointer'>
                    <img src={post.image} alt='postimage' className='rounded-sm my-2 w-full aspect-square object-cover' />
                    <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300' >
                      <div className='flex items-center text-white space-x-4'>
                         <button 
                        onClick={() => navigateToPost('/')} 
                        className='flex items-center gap-2 hover:text-gray-300'
                      >
                        <Heart />
                        <span>{post?.likes.length}</span>
                      </button>
                      <button 
                        onClick={() => navigateToPost('/')} 
                        className='flex items-center gap-2 hover:text-gray-300'
                      >
                        <MessageCircle />
                        <span>{post?.comments.length}</span>
                      </button>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile