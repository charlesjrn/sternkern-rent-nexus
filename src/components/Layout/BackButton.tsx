import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={() => navigate(-1)}
      className="mb-4"
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      Back
    </Button>
  );
};

export default BackButton;