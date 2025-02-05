import React, { useState, useEffect } from 'react';
import { X, Heart, User, MessageCircle, Briefcase, MapPin, DollarSign, Building2, Search, Filter, Bell, Star, Check, Send } from 'lucide-react';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const AIChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const systemMessage = {
    role: "system",
    content: "You are a career coach AI assistant specialized in tech jobs. Help users with: "
      + "- Resume reviews and optimization tips\n"
      + "- Technical interview preparation\n"
      + "- Networking strategies\n"
      + "- Recruiter communication\n"
      + "- Job search strategies\n"
      + "- Salary negotiation tips\n"
      + "Keep responses professional yet friendly. Ask clarifying questions when needed."
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [systemMessage, ...messages, userMessage],
        temperature: 0.7,
      });

      const aiMessage = {
        role: "assistant",
        content: completion.choices[0].message.content
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, I'm having trouble connecting. Please try again later."
      }]);
    }
    setIsLoading(false);
  };

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col p-4">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-xl ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white shadow-sm border border-gray-100'
            }`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white shadow-sm border border-gray-100 p-4 rounded-xl">
              <div className="animate-pulse">Thinking...</div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about resume tips, interviews, or career advice..."
          className="flex-1 p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="p-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
const Messages = () => {
  const messages = [
    {
      id: 1,
      company: "Tech Corp",
      avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Felixsh",
      lastMessage: "Thanks for your interest! When are you available for an interview?",
      time: "2m ago",
      unread: true
    },
    {
      id: 2,
      company: "Startup Inc",
      avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=BRUV",
      lastMessage: "Hi! We'd love to discuss the position with you.",
      time: "1h ago",
      unread: false
    }
  ];

  return (
    <div className="p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`bg-white p-4 rounded-xl shadow-sm border-l-4 ${
            message.unread ? 'border-indigo-500' : 'border-transparent'
          } hover:shadow-md transition-shadow duration-200`}
        >
          <div className="flex items-center gap-4">
            <img src={message.avatar} alt="" className="w-12 h-12 rounded-full" />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-800">{message.company}</h3>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{message.time}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1 truncate">{message.lastMessage}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const Profile = () => {
  const skills = ['React', 'Node.js', 'TypeScript', 'Python', 'AWS'];
  const experience = [
    {
      company: 'Previous Corp',
      position: 'Senior Developer',
      duration: '2020 - Present'
    },
    {
      company: 'Start Up',
      position: 'Full Stack Developer',
      duration: '2018 - 2020'
    }
  ];

  return (
    <div className="p-4 space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 text-center relative">
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto relative">
            <img src="https://api.dicebear.com/9.x/adventurer/svg?seed=IamAndIShallBeAnother" alt="" className="w-24 h-24 rounded-full object-cover" />
            <button className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-lg">
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">John Doe</h2>
        <p className="text-gray-600 mb-6">Full Stack Developer</p>

        <div className="flex justify-center gap-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">23</div>
            <div className="text-sm text-gray-600">Applications</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">8</div>
            <div className="text-sm text-gray-600">Matches</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span key={skill} className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Experience</h3>
        <div className="space-y-6">
          {experience.map((exp, index) => (
            <div key={index} className="border-l-2 border-indigo-200 pl-4">
              <h4 className="font-semibold text-gray-800 text-lg">{exp.position}</h4>
              <p className="text-gray-600 mb-1">{exp.company}</p>
              <p className="text-sm text-gray-500">{exp.duration}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const JobCard = ({ job, offsetX = 0, swipeDirection, handleTouchStart, handleTouchMove, handleTouchEnd, isDragging, userLocation }) => {
  const [travelTime, setTravelTime] = useState(null);

  useEffect(() => {
    const fetchTravelTime = async () => {
      if (userLocation) {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/Hirely/TravelTime?origin=${userLocation.latitude},${userLocation.longitude}&destination=${job.location}&mode=driving`);
          const data = await response.json();
          setTravelTime(data.travelTime);
        } catch (error) {
          console.error('Error fetching travel time:', error);
        }
      }
    };

    fetchTravelTime();
  }, [userLocation, job.location]);

  return (
    <div
      className={`transform transition-all duration-300 touch-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        transform: `translateX(${offsetX}px) rotate(${offsetX * 0.1}deg)`,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className={`relative bg-white rounded-xl shadow-lg p-6 mb-4 overflow-hidden
        ${swipeDirection === 'right' ? 'bg-green-50' : swipeDirection === 'left' ? 'bg-red-50' : ''}`}>
        <div className="absolute top-4 right-4 bg-indigo-100 px-4 py-1 rounded-full">
          <span className="text-indigo-600 text-sm font-medium">{job.company}</span>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-2 pr-32">{job.position}</h2>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-600">
            <Building2 className="w-5 h-5 mr-3 flex-shrink-0" />
            <span className="text-lg">{job.company}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-5 h-5 mr-3 flex-shrink-0" />
            <span className="text-lg">{job.location}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <DollarSign className="w-5 h-5 mr-3 flex-shrink-0" />
            <span className="text-lg">{job.salary}</span>
          </div>
        </div>

        <div className="bg-indigo-50 rounded-lg p-4 mb-6">
          <p className="text-gray-700 leading-relaxed">{job.description}</p>
        </div>
        <div>
          <div className="flex flex-wrap gap-2">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              travelTime ? (
                travelTime.includes('hour') || travelTime.includes('day') ? 'bg-red-100 text-red-700' :
                parseInt(travelTime) > 20 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
              ) : 'bg-gray-100 text-gray-700'
            }`}>
              {travelTime ? (
                <>
                  <span className="mr-2">🚗: {travelTime}</span>
                </>
              ) : 'Calculating travel time...'}
            </span>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-gray-800 text-lg">Requirements:</h4>
          <div className="flex flex-wrap gap-2">
            {job.requirements.map((req, index) => (
              <span key={index} className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                {req}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const SearchFilters = ({ onSearch, onFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="mb-6">
      <div className="flex gap-3 mb-3">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search jobs..."
            className="w-full p-3 pl-10 rounded-xl border border-gray-200 text-lg"
            onChange={(e) => onSearch?.(e.target.value)}
          />
          <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <Filter className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {isOpen && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 space-y-6">
          <div>
            <h4 className="font-semibold mb-3 text-gray-800">Location</h4>
            <select className="w-full p-3 rounded-xl border border-gray-200 text-lg">
              <option>All Locations</option>
              <option>Remote</option>
              <option>Montreal</option>
              <option>Quebec City</option>
              <option>Laval</option>
              <option>Gatineau</option>
              <option>Longueuil</option>
              <option>Sherbrooke</option>
              <option>Levis</option>
              <option>Trois-Rivieres</option>
              <option>Remote</option>
            </select>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-gray-800">Salary Range</h4>
            <select className="w-full p-3 rounded-xl border border-gray-200 text-lg">
              <option>Any Salary</option>
              <option>$50k - $100k</option>
              <option>$100k - $150k</option>
              <option>$150k+</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

const Matches = ({ matches }) => (
  <div className="p-4 space-y-4">
    {matches.map((match) => (
      <div key={match.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center gap-4">
          <img src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${match.id}`} alt="" className="w-12 h-12 rounded-full" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 mb-1">{match.company}</h3>
            <p className="text-sm text-gray-600">{match.position}</p>
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm hover:bg-indigo-700 transition-colors">
            Message
          </button>
        </div>
      </div>
    ))}
  </div>
);

const JobMatchingApp = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTab, setCurrentTab] = useState('jobs');
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showMatch, setShowMatch] = useState(false);

  const [userLocation, setUserLocation] = useState(null);

  const [apiData, setApiData] = useState(""); // Save API response

  // Function to fetch API data
  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/test`);
      const data = await response.json();
      setApiData(data); // Store in variable (state)
    } catch (error) {
      console.error("Error fetching /test:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Call API on component mount
  }, []);

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ latitude, longitude });
            console.log("Latitude:", latitude, "Longitude:", longitude);
          },
          (err) => {
            setError("Error getting location: " + err.message);
            console.error("Error getting location:", err);
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
        console.error("Geolocation is not supported by this browser.");
      }
    };

    getUserLocation();
  }, []);
  const [matches] = useState([
    { id: 1, company: 'Tech Corp', position: 'Senior React Developer' },
    { id: 2, company: 'Startup Inc', position: 'Frontend Engineer' }
  ]);

  const [jobs] = useState(
    require('./jobsData.json')
  );

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    setOffsetX(diff);

    if (diff > 50) {
      setSwipeDirection('right');
    } else if (diff < -50) {
      setSwipeDirection('left');
    } else {
      setSwipeDirection(null);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (offsetX > 100) {
      handleSwipe('right');
    } else if (offsetX < -100) {
      handleSwipe('left');
    }
    setOffsetX(0);
    setSwipeDirection(null);
  };

  const handleSwipe = (direction) => {
    if (direction === 'right') {
      if (Math.random() < 0.3) {
        setShowMatch(true);
        setTimeout(() => setShowMatch(false), 2000);
      }
    }

    if (currentIndex < jobs.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {showMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 text-center transform scale-110 animate-bounce shadow-xl">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-indigo-600 mb-2">It's a Match!</h3>
            <p className="text-gray-600 mb-4">You matched with Tech Corp</p>
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors">
              Send Message
            </button>
          </div>
        </div>
      )}

      <nav className="bg-white shadow-md p-4 mb-6">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Hirely
          </h1>
          <div className="flex gap-3">
            <button className="relative">
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                2
              </span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-xl mx-auto px-4 pb-24">
        {currentTab === 'jobs' && (
          <div>
            <SearchFilters onSearch={() => {}} onFilter={() => {}} />
            <JobCard
              job={jobs[currentIndex]}
              userLocation={userLocation}
              offsetX={offsetX}
              swipeDirection={swipeDirection}
              handleTouchStart={handleTouchStart}
              handleTouchMove={handleTouchMove}
              handleTouchEnd={handleTouchEnd}
              isDragging={isDragging}
            />
            <div className="flex justify-center gap-8 mt-8">
              <button
                onClick={() => handleSwipe('left')}
                className="p-5 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors duration-200"
              >
                <X className="w-8 h-8 text-red-500" />
              </button>
              <button
                onClick={() => handleSwipe('right')}
                className="p-5 bg-white rounded-full shadow-lg hover:bg-green-50 transition-colors duration-200"
              >
                <Heart className="w-8 h-8 text-green-500" />
              </button>
            </div>
          </div>
        )}

        {currentTab === 'chat' && <AIChatBot />}
        {currentTab === 'profile' && <Profile />}
        {currentTab === 'matches' && <Matches matches={matches} />}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex justify-around items-center p-2 max-w-xl mx-auto">
          {[
            { id: 'jobs', icon: Briefcase, label: 'Jobs' },
            { id: 'matches', icon: Star, label: 'Matches' },
            { id: 'chat', icon: MessageCircle, label: 'Career Coach' },
            { id: 'profile', icon: User, label: 'Profile' }
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setCurrentTab(id)}
              className={`relative flex flex-col items-center py-2 px-6 transition-all duration-200 ${
                currentTab === id 
                ? 'text-indigo-600 scale-110' 
                : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-12 h-1 rounded-full transition-all duration-200 ${
                currentTab === id ? 'bg-indigo-600' : 'bg-transparent'
              }`} />
              <Icon className={`w-6 h-6 mb-1 transition-transform duration-200 ${
                currentTab === id ? 'scale-110' : ''
              }`} />
              <span className={`text-xs font-medium transition-all duration-200 ${
                currentTab === id ? 'opacity-100' : 'opacity-70'
              }`}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobMatchingApp;