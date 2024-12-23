"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bot } from "lucide-react";

import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import React from "react";
import { motion } from "framer-motion";
import { LampContainer } from "@/components/ui/lamp";
import { Highlight } from "@/components/ui/hero-highlight";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { Vortex } from "@/components/ui/vortex";
import SignInButton from "@/components/ui/ui/signInButton";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center">
      <main className="flex flex-col justify-center w-full max-w-screen-lg divide-y divide-solid space-y-8 px-4 sm:px-6 lg:px-8">
        <LampContainer>
          <motion.h1
            initial={{ opacity: 0.1, y: 200 }}
            whileInView={{ opacity: 1, y: -50 }}
            transition={{
              delay: 0.2,
              duration: 1.5,
              ease: "easeInOut",
            }}
            className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-2xl font-medium tracking-tight text-transparent sm:text-4xl md:text-6xl lg:text-7xl"
          >
            Twój quizowy asystent{" "}
            <Highlight className="text-black dark:text-white">AI</Highlight>.
          </motion.h1>
        </LampContainer>
        <div>
          <p className="text-lg sm:text-2xl p-4 text-center text-gray-200">
            Twórz pytania z łatwością
          </p>
          <div className="flex flex-col sm:flex-row text-gray-300">
            <div className="w-full sm:w-1/3 p-4 flex justify-center">
              <Bot size={"full"} />
            </div>
            <div className="w-full sm:w-2/3 px-4">
              <TextGenerateEffect
                className="text-sm sm:text-lg font-light"
                words={
                  "Kanada jest drugim największym krajem na świecie pod względem powierzchni i składa się z dziesięciu prowincji oraz trzech terytoriów. W którym z poniższych miast znajduje się siedziba rządu federalnego Kanady, a zarazem jest ono jej stolicą?"
                }
                duration={3}
              />
              <TextGenerateEffect
                className="text-sm sm:text-lg font-light italic mt-2"
                words={
                  "✔ Toronto, największe miasto Kanady, znane z CN Tower i różnorodności kulturowej."
                }
                duration={1}
                delay={4}
              />
              <TextGenerateEffect
                className="text-sm sm:text-lg font-light italic mt-2"
                words={
                  "❌ Vancouver, położone na zachodnim wybrzeżu, znane z pięknych krajobrazów i bliskości gór."
                }
                duration={1}
                delay={5}
              />
              <TextGenerateEffect
                className="text-sm sm:text-lg font-light italic mt-2"
                words={
                  "❌ Ottawa, miasto nad rzeką o tej samej nazwie, gdzie znajdują się budynki parlamentu i siedziba premiera."
                }
                duration={1}
                delay={6}
              />
            </div>
          </div>
        </div>
        <div>
          <div className="p-4 text-center">
            <p className="text-lg sm:text-2xl text-gray-200">
              Wybierz swój plan
            </p>
            <p className="text-sm text-gray-500">Plany i Ceny</p>
            <p className="text-sm sm:text-xl">
              Zacznij za darmo, potem ulepsz plan i odblokuj funkcje AI i wiele
              więcej
            </p>
          </div>
          <div className="flex flex-col lg:flex-row justify-center space-y-8 lg:space-y-0 lg:space-x-8">
            <Card className="w-full lg:w-96">
              <CardHeader>
                <CardTitle>Basic</CardTitle>
                <CardDescription>Ograniczone funkcjonalności</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold">0 PLN</p>
              </CardContent>
              <CardFooter>
                <ul className="list-disc p-6">
                  <li>Przeglądanie quizów</li>
                  <li>Uczestnictwo w quizach</li>
                </ul>
              </CardFooter>
            </Card>
            <Card className="w-full lg:w-96">
              <CardHeader>
                <CardTitle>Standard</CardTitle>
                <CardDescription>Premium</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold">35 PLN/mies</p>
              </CardContent>
              <CardFooter>
                <ul className="list-disc p-6">
                  <li>Przeglądanie quizów</li>
                  <li>Uczestnictwo w quizach</li>
                  <li>Tworzenie AI quizów</li>
                </ul>
              </CardFooter>
            </Card>
            <Card className="w-full lg:w-96">
              <CardHeader>
                <CardTitle>Deluxe</CardTitle>
                <CardDescription>Wszystko czego potrzebujesz</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold">50 PLN/mies</p>
              </CardContent>
              <CardFooter>
                <ul className="list-disc p-6">
                  <li>Przeglądanie quizów</li>
                  <li>Uczestnictwo w quizach</li>
                  <li>Tworzenie AI quizów</li>
                  <li>Eksport do Moodle'a</li>
                </ul>
              </CardFooter>
            </Card>
          </div>
        </div>
        <div>
          <p className="text-center text-lg sm:text-2xl text-gray-200 p-6">
            Funkcje
          </p>
          <div className="flex flex-wrap">
            {[
              {
                title: "Generuj",
                subtitle: "Quizy, testy i sprawdziany",
                description:
                  "Użyj naszego generatora testów AI, aby natychmiast tworzyć quizy i oceny z istniejących treści.",
              },
              {
                title: "Zapamiętuj",
                subtitle: "Przyśpiesz naukę",
                description:
                  "Użyj powtórzeń w odstępach czasu, aby zoptymalizować naukę, powtarzając trudniejsze koncepcje w idealnych odstępach czasu.",
              },
              {
                title: "Aplikacja mobilna",
                subtitle: "Ucz się wszędzie",
                description:
                  "Uzyskaj dostęp do potężnych narzędzi do nauki w dowolnym czasie i miejscu dzięki naszej aplikacji.",
              },
              {
                title: "Twój nauczyciel AI",
                subtitle: "Śledź postępy",
                description:
                  "Nasza sztuczna inteligencja inteligentnie ocenia pytania w stylu esejów i egzaminów.",
              },
            ].map((feature, idx) => (
              <div key={idx} className="w-full sm:w-1/2 p-4">
                <CardContainer className="min-w-full">
                  <CardBody className="min-w-full dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] rounded-xl p-4 border">
                    <CardItem
                      translateZ="50"
                      className="text-m font-bold text-neutral-600 dark:text-white"
                    >
                      {feature.title}
                    </CardItem>
                    <CardItem translateZ="100" className="w-full mt-4 text-lx">
                      {feature.subtitle}
                    </CardItem>
                    <CardItem
                      as="p"
                      translateZ="60"
                      className="text-neutral-500 text-sm mt-2 dark:text-neutral-300"
                    >
                      {feature.description}
                    </CardItem>
                  </CardBody>
                </CardContainer>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="w-full md:w-[calc(100%-4rem)] mx-auto rounded-md h-auto overflow-hidden p-6">
            <Vortex className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full">
              <h2 className="text-white text-lg sm:text-2xl md:text-4xl font-bold text-center">
                Dołączasz?
              </h2>
              <p className="text-white text-sm md:text-lg max-w-xl mt-4 text-center">
                Dołącz do świata wiedzy i rywalizacji z naszą aplikacją quizów
                AI - poszerzaj horyzonty, zdobywaj punkty i baw się, ucząc się
                czegoś nowego każdego dnia!
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
                <SignInButton />
              </div>
            </Vortex>
          </div>
        </div>
      </main>
      <footer className="footer pb-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          <p className="text-gray-200 text-center">
            © 2024 Quizzly. All rights reserved.
          </p>
          <p className="text-gray-200 text-center">
            Made with 🖤 by Quizzly Team
          </p>
        </div>
      </footer>
    </div>
  );
}
