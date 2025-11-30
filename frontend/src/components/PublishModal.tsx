import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ExternalLink } from 'lucide-react';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (platforms: string[]) => void;
}

interface Platform {
  id: string;
  name: string;
  description: string;
  icon: string;
  connected: boolean;
}

export function PublishModal({ isOpen, onClose, onPublish }: PublishModalProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const platforms: Platform[] = [
    {
      id: 'wordpress',
      name: 'WordPress',
      description: 'Publish to your WordPress blog',
      icon: '📝',
      connected: true
    },
    {
      id: 'medium',
      name: 'Medium',
      description: 'Share on Medium platform',
      icon: 'Ⓜ️',
      connected: true
    },
    {
      id: 'devto',
      name: 'Dev.to',
      description: 'Post to Dev.to community',
      icon: '👨‍💻',
      connected: false
    },
    {
      id: 'hashnode',
      name: 'Hashnode',
      description: 'Publish on Hashnode',
      icon: '📰',
      connected: true
    },
    {
      id: 'ghost',
      name: 'Ghost',
      description: 'Publish to Ghost blog',
      icon: '👻',
      connected: false
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description: 'Share as LinkedIn article',
      icon: '💼',
      connected: true
    }
  ];

  const handleTogglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handlePublish = () => {
    if (selectedPlatforms.length === 0) {
      return;
    }

    const platformNames = platforms
      .filter(p => selectedPlatforms.includes(p.id))
      .map(p => p.name);

    onPublish(platformNames);
    setSelectedPlatforms([]);
  };

  const handleClose = () => {
    setSelectedPlatforms([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Publish Your Blog Post</DialogTitle>
          <DialogDescription>
            Select the platforms where you want to publish this post. You can publish to multiple platforms at once.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3">
            {platforms.map((platform) => (
              <div key={platform.id}>
                <div 
                  className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                    selectedPlatforms.includes(platform.id) 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  } ${!platform.connected ? 'opacity-60' : 'cursor-pointer'}`}
                  onClick={() => platform.connected && handleTogglePlatform(platform.id)}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={platform.id}
                      checked={selectedPlatforms.includes(platform.id)}
                      onCheckedChange={() => platform.connected && handleTogglePlatform(platform.id)}
                      disabled={!platform.connected}
                    />
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{platform.icon}</span>
                      <div>
                        <Label 
                          htmlFor={platform.id} 
                          className={`text-base ${platform.connected ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                        >
                          {platform.name}
                        </Label>
                        <p className="text-sm text-gray-500">{platform.description}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    {platform.connected ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Connected
                      </Badge>
                    ) : (
                      <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm mb-2 text-blue-900">Publishing Info</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Your post will be published immediately to selected platforms</li>
              <li>• You can edit or remove posts from each platform's dashboard</li>
              <li>• SEO metadata and images will be automatically optimized</li>
              <li>• This is a demo - actual publishing requires API integration</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handlePublish}
            disabled={selectedPlatforms.length === 0}
            className="bg-emerald-700 hover:bg-emerald-800"
          >
            Publish to {selectedPlatforms.length} {selectedPlatforms.length === 1 ? 'Platform' : 'Platforms'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
