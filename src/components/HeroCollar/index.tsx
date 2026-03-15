"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

export default function HeroCollar() {
  useEffect(() => {
    // Load model-viewer script only once
    if (!document.querySelector('script[src*="model-viewer"]')) {
      const script = document.createElement("script");
      script.src =
        "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
      script.type = "module";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <div
      id="product"
      className="relative w-full h-auto flex justify-center items-center my-20"
      ref={sectionRef}
    >
      <motion.div
        className="w-full flex justify-center items-center"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Background */}
        <Image
          src="/heroCollar/background.png"
          alt="bg"
          width={1000}
          height={1000}
          className="w-[85%] sm:w-[80%] h-[80%] rounded-3xl sm:rounded-[50px]"
        />

        {/* Text Overlay */}
        <div className="absolute sm:flex flex-col justify-around text-secondary opacity-50 w-[80%] h-[80%] text-center text-[10vw] overflow-hidden text-nowrap leading-tight font-borela">
          <h3>TAILORED</h3>
          <h3>TECHNOLOGY</h3>
          <h3>FOR YOUR PET</h3>
        </div>

        {/* 3D Model */}
        {isInView && (
          // @ts-ignore
          <model-viewer
            src="/dogCollar1.glb"
            alt="A 3D model of a dog collar"
            loading="lazy"
            camera-controls
            camera-orbit="-10deg 60deg 45deg"
            disable-zoom
            disable-pan
            shadow-intensity="1"
            environment-image="neutral"
            className="absolute w-[100%] h-[100%] sm:w-[80%] sm:h-[80%]"
          />
        )}
      </motion.div>
    </div>
  );
}
