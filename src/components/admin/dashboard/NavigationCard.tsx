
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface NavigationCardProps {
  title: string;
  description: string;
  content: string;
  buttonText: string;
  onButtonClick: () => void;
}

const NavigationCard: React.FC<NavigationCardProps> = ({
  title,
  description,
  content,
  buttonText,
  onButtonClick
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{content}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={onButtonClick}>{buttonText}</Button>
      </CardFooter>
    </Card>
  );
};

export default NavigationCard;
