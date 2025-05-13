
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const Profile = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  
  useEffect(() => {
    document.title = language === 'nl' ? 'Gebruikersprofiel' : 'User Profile';
  }, [language]);
  
  return (
    <div className="min-h-screen w-full relative">
      <Navbar />
      <main className="container pt-24 pb-16 min-h-[calc(100vh-64px)]">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'nl' ? 'Mijn Profiel' : 'My Profile'}
              </CardTitle>
              <CardDescription>
                {language === 'nl' 
                  ? 'Bekijk en beheer uw accountinformatie' 
                  : 'View and manage your account information'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium">
                      {language === 'nl' ? 'E-mailadres' : 'Email address'}
                    </h3>
                    <p className="text-lg">{user.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">
                      {language === 'nl' ? 'Account ID' : 'Account ID'}
                    </h3>
                    <p className="text-sm text-muted-foreground">{user.id}</p>
                  </div>
                </div>
              ) : (
                <p>
                  {language === 'nl' 
                    ? 'U bent niet ingelogd.' 
                    : 'You are not logged in.'}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
