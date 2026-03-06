'use client'
import React from 'react'
import { Clock, Kanban, MoveUpRight, PawPrint } from "lucide-react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

export default function DogServices() {
    const walkingRef = React.useRef(null);
    const walkingInView = useInView(walkingRef, { 
        once: true, 
        amount: 0.1 
    });

    const boardingRef = React.useRef(null);
    const boardingInView = useInView(boardingRef, { 
        once: true, 
        amount: 0.1 
    });

    return (
        <div className="w-full">
                {/* Dog Walking Service */}
                <motion.div 
                    
                    initial={{ x: -100, opacity: 0 }}
                    animate={walkingInView ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" as const }}
                    className="flex flex-col lg:flex-row my-6 md:my-10 bg-white p-4 sm:p-6 md:p-10 rounded-3xl text-secondary"
                >
                    <div className="w-full lg:w-1/2 flex justify-center lg:justify-start mb-6 lg:mb-0">
                        <Image
                            src="/services/dog-walking-women.png"
                            alt="dog walking women"
                            width={1000}
                            height={1000}
                            className="w-auto max-h-[50vh] lg:max-h-[80vh] object-cover"
                        />
                    </div>
                    <div className="w-full lg:w-1/2 lg:pl-8">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-borela">
                            DOG <span className="text-background">WALKING</span> <br /> SERVICE
                        </h1>
                        <p className="text-lg md:text-xl lg:text-2xl my-3 md:my-5 font-montserrat" ref={walkingRef}>
                            Soon, we&apos;ll offer reliable dog walking tailored to your dog&apos;s
                            needs, ensuring they get the exercise and attention they deserve.
                        </p>
                        <ul className="space-y-3 md:space-y-4 my-6 md:my-10">
                            <li className="flex gap-3 md:gap-4 text-background font-montserrat items-center text-lg md:text-xl lg:text-2xl">
                                <Clock className="bg-primary rounded-full p-2 md:p-3 text-foreground h-10 w-10 md:h-12 md:w-12" />
                                Flexible time schedules
                            </li>
                            <li className="flex gap-3 md:gap-4 text-background font-montserrat items-center text-lg md:text-xl lg:text-2xl">
                                <Kanban className="bg-primary rounded-full p-2 md:p-3 text-foreground h-10 w-10 md:h-12 md:w-12" />
                                Safe routes and fun experiences
                            </li>
                            <li className="flex gap-3 md:gap-4 text-background font-montserrat items-center text-lg md:text-xl lg:text-2xl">
                                <PawPrint className="bg-primary rounded-full p-2 md:p-3 text-foreground h-10 w-10 md:h-12 md:w-12" />
                                Individual and group walks
                            </li>
                        </ul>
                        <button className="flex bg-background p-3 md:p-4 gap-3 md:gap-4 text-white rounded-full mt-6 md:mt-10 lg:mt-16 font-borela text-lg md:text-xl lg:text-2xl items-center px-4 md:px-6">
                            BECOME A DOG WALKER{" "}
                            <MoveUpRight className="bg-primary rounded-full p-2 md:p-3 text-foreground h-10 w-10 md:h-12 md:w-12" />
                        </button>
                    </div>
                </motion.div>

                {/* Dog Boarding Service */}
                <motion.div 
                    
                    initial={{ x: 100, opacity: 0 }}
                    animate={boardingInView ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" as const }}
                    className="flex flex-col-reverse lg:flex-row my-6 md:my-10 bg-white p-4 sm:p-6 md:p-10 rounded-3xl text-secondary"
                >
                    <div className="w-full lg:w-1/2 lg:pr-8">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-borela mt-6 lg:mt-0">
                            DOG <span className="text-background">BOARDING</span> <br /> SERVICE
                        </h1>
                        <p className="text-lg md:text-xl lg:text-2xl my-3 md:my-5 font-montserrat" ref={boardingRef}>
                            We&apos;re creating a safe, comfortable space where your dog will
                            receive the care and attention they need while you&apos;re away.
                        </p>
                        <ul className="space-y-3 md:space-y-4 my-6 md:my-10">
                            <li className="flex gap-3 md:gap-4 text-background font-montserrat items-center text-lg md:text-xl lg:text-2xl">
                                <Clock className="bg-primary rounded-full p-2 md:p-3 text-foreground h-10 w-10 md:h-12 md:w-12" />
                                Safe and clean accommodations
                            </li>
                            <li className="flex gap-3 md:gap-4 text-background font-montserrat items-center text-lg md:text-xl lg:text-2xl">
                                <Kanban className="bg-primary rounded-full p-2 md:p-3 text-foreground h-10 w-10 md:h-12 md:w-12" />
                                Personalized care and feeding
                            </li>
                            <li className="flex gap-3 md:gap-4 text-background font-montserrat items-center text-lg md:text-xl lg:text-2xl">
                                <PawPrint className="bg-primary rounded-full p-2 md:p-3 text-foreground h-10 w-10 md:h-12 md:w-12" />
                                Monitoring with regular updates
                            </li>
                        </ul>
                        <button className="flex bg-background p-3 md:p-4 gap-3 md:gap-4 text-white rounded-full mt-6 md:mt-10 lg:mt-16 font-borela text-lg md:text-xl lg:text-2xl items-center px-4 md:px-6">
                            BECOME A PET SITTER{" "}
                            <MoveUpRight className="bg-primary rounded-full p-2 md:p-3 text-foreground h-10 w-10 md:h-12 md:w-12" />
                        </button>
                    </div>
                    <div className="w-full lg:w-1/2 flex justify-center lg:justify-end mb-6 lg:mb-0">
                        <Image
                            src="/services/dog-boarding-women.png"
                            alt="dog boarding women"
                            width={1000}
                            height={1000}
                            className="w-auto max-h-[50vh] lg:max-h-[80vh] object-cover"
                        />
                    </div>
                </motion.div>
            </div>
    )
}
