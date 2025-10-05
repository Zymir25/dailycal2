import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Apple, Droplets, History, User } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Logo } from '@/components/logo';

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-image');

  const features = [
    {
      icon: <Apple className="h-8 w-8 text-primary" />,
      title: 'Effortless Food Logging',
      description: 'Quickly log your meals with our intuitive interface. Let our AI handle the nutritional breakdown.',
    },
    {
      icon: <Droplets className="h-8 w-8 text-primary" />,
      title: 'Hydration Tracking',
      description: 'Stay on top of your water intake goals with our simple and effective water tracker.',
    },
    {
      icon: <History className="h-8 w-8 text-primary" />,
      title: 'Insightful History',
      description: 'Review your past entries to understand your eating habits and track your progress over time.',
    },
    {
      icon: <User className="h-8 w-8 text-primary" />,
      title: 'Personalized Profile',
      description: 'Set your personal goals and preferences to get a customized calorie and macro-nutrient plan.',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Logo />
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 lg:py-40">
          <div className="container text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Mindful Eating, Simplified.
            </h1>
            <p className="mx-auto mt-4 max-w-[700px] text-lg text-muted-foreground md:text-xl">
              Welcome to DailyCal Flow, your personal guide to a healthier lifestyle. Track your meals, monitor your hydration, and achieve your wellness goals with ease.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/signup">Start Your Journey</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full bg-muted py-12 md:py-24 lg:py-32">
          <div className="container space-y-12 px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
                <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need to Succeed</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our app is packed with features designed to make health and nutrition tracking seamless and enjoyable.
                </p>
              </div>
            </div>
            <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-2">
              {features.map((feature, index) => (
                <Card key={index} className="h-full transition-transform hover:scale-105 hover:shadow-lg">
                  <CardHeader className="flex flex-row items-center gap-4">
                    {feature.icon}
                    <CardTitle className="font-headline">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <Logo />
          <p className="text-sm text-muted-foreground">&copy; 2024 DailyCal Flow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
