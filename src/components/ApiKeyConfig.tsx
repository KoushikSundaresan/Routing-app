
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, ExternalLink, CheckCircle } from 'lucide-react';

const ApiKeyConfig: React.FC = () => {
  const [openRouteKey, setOpenRouteKey] = useState('');
  const [weatherKey, setWeatherKey] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Load saved API keys from localStorage
    const savedRouteKey = localStorage.getItem('openroute_api_key') || '';
    const savedWeatherKey = localStorage.getItem('weather_api_key') || '';
    
    setOpenRouteKey(savedRouteKey);
    setWeatherKey(savedWeatherKey);
  }, []);

  const saveApiKeys = () => {
    if (openRouteKey.trim()) {
      localStorage.setItem('openroute_api_key', openRouteKey.trim());
    } else {
      localStorage.removeItem('openroute_api_key');
    }
    
    if (weatherKey.trim()) {
      localStorage.setItem('weather_api_key', weatherKey.trim());
    } else {
      localStorage.removeItem('weather_api_key');
    }
    
    setIsExpanded(false);
    
    // Refresh the page to apply new API keys
    window.location.reload();
  };

  const clearApiKeys = () => {
    localStorage.removeItem('openroute_api_key');
    localStorage.removeItem('weather_api_key');
    setOpenRouteKey('');
    setWeatherKey('');
    window.location.reload();
  };

  if (!isExpanded) {
    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Free API Configuration</span>
              <Badge variant="outline" className="text-xs bg-green-500/10 text-green-700 border-green-500/20">
                100% Free
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(true)}
            >
              Configure
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          Free API Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-1 block">
              OpenRouteService API Key (Optional)
            </label>
            <Input
              placeholder="Get free key from openrouteservice.org"
              value={openRouteKey}
              onChange={(e) => setOpenRouteKey(e.target.value)}
              type="password"
            />
            <div className="flex items-center gap-2 mt-1">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span className="text-xs text-muted-foreground">2,000 requests/day free</span>
              <a 
                href="https://openrouteservice.org/dev/#/signup"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                Get Free Key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              OpenWeatherMap API Key (Optional)
            </label>
            <Input
              placeholder="Get free key from openweathermap.org"
              value={weatherKey}
              onChange={(e) => setWeatherKey(e.target.value)}
              type="password"
            />
            <div className="flex items-center gap-2 mt-1">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span className="text-xs text-muted-foreground">1,000 calls/day free</span>
              <a 
                href="https://openweathermap.org/api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                Get Free Key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-3">
          <h4 className="text-sm font-medium mb-2">What's Free Without API Keys:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Map display (OpenStreetMap) - Unlimited</li>
            <li>• Address search (Nominatim) - No key needed</li>
            <li>• Mock route calculation</li>
            <li>• Mock weather data</li>
          </ul>
        </div>

        <div className="flex gap-2">
          <Button onClick={saveApiKeys} className="flex-1">
            Save & Apply
          </Button>
          <Button variant="outline" onClick={clearApiKeys}>
            Clear All
          </Button>
          <Button variant="ghost" onClick={() => setIsExpanded(false)}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyConfig;
