import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const images = [
  "/randomlogo.png",
  "/randomlogo.png",
  "/randomlogo.png",
  "/randomlogo.png",
  "/randomlogo.png",
];

export default function CarouselPlugin() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 2000, stopOnInteraction: false }),
  ]);

  return (
    <div className="flex items-center justify-start w-full h-screen">
      <div
        className="relative w-full h-full max-w-lg md:w-1/2 embla"
        ref={emblaRef}
      >
        <Carousel className="h-full">
          <CarouselContent className="h-full">
            {images.map((src, index) => (
              <CarouselItem key={index} className="h-full">
                <div className="h-full">
                  <img
                    src={src}
                    alt={`Slide ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-0 z-10 ml-2" />
          <CarouselNext className="absolute right-0 z-10 mr-2" />
        </Carousel>
      </div>
    </div>
  );
}
