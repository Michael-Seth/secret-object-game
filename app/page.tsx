"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// Sample objects for the game
const gameObjects = [
  { title: "Banana", img: "/yellow-banana-fruit.png" },
  { title: "Mug", img: "/white-coffee-mug-with-steam.png" },
  { title: "Bicycle", img: "/bicycle.jpg" },
  { title: "Pizza", img: "/delicious-toppings-pizza.png" },
  { title: "Guitar", img: "/acoustic-guitar-musical-instrument.png" },
  { title: "Sunflower", img: "/bright-yellow-sunflower.png" },
  { title: "Airplane", img: "/airplane.jpg" },
  { title: "Airpod", img: "/airpod.jpg" },
  { title: "Cake", img: "/cake.jpg" },
  { title: "Chair", img: "/chair.jpg" },
  { title: "Glasses", img: "/eye-glass.jpg" },
  { title: "Fan", img: "/fan.jpg" },
  { title: "Football", img: "/football.jpg" },
  { title: "Keyboard", img: "/Keyboard.jpg" },
  { title: "Ladder", img: "/ladder.jpg" },
  { title: "Laptop", img: "/laptop.jpg" },
  { title: "Mouse", img: "/mouse.jpg" },
  { title: "Train", img: "/train.jpg" },
  { title: "Speaker", img: "/speaker.jpg" },
  { title: "Car", img: "/car.jpg" },
]

type GameState = "playing" | "finished"
type Team = "A" | "B"

export default function SecretObjectGame() {
  const [gameState, setGameState] = useState<GameState>("playing")
  const [currentTeam, setCurrentTeam] = useState<Team>("A")
  const [teamAScore, setTeamAScore] = useState(0)
  const [teamBScore, setTeamBScore] = useState(0)
  const [currentRound, setCurrentRound] = useState(1)
  const [currentObjectIndex, setCurrentObjectIndex] = useState(0)
  const [shuffledObjects, setShuffledObjects] = useState(gameObjects)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(20)

  const maxRounds = 10
  const currentObject = shuffledObjects[currentObjectIndex]

  useEffect(() => {
    const shuffled = [...gameObjects].sort(() => Math.random() - 0.5)
    setShuffledObjects(shuffled)
  }, [])

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showConfetti])

  useEffect(() => {
    if (gameState === "playing" && !isTransitioning && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && gameState === "playing" && !isTransitioning) {
      nextTurn(false)
    }
  }, [timeLeft, gameState, isTransitioning])

  const nextTurn = (addPoint = false) => {
    setIsTransitioning(true)

    if (addPoint) {
      if (currentTeam === "A") {
        setTeamAScore((prev) => prev + 1)
      } else {
        setTeamBScore((prev) => prev + 1)
      }
    }

    setTimeout(() => {
      setCurrentTeam(currentTeam === "A" ? "B" : "A")

      const nextIndex = (currentObjectIndex + 1) % shuffledObjects.length
      setCurrentObjectIndex(nextIndex)

      if (currentTeam === "B") {
        const nextRound = currentRound + 1
        setCurrentRound(nextRound)

        if (nextRound > maxRounds) {
          setGameState("finished")
          setShowConfetti(true)
        }
      }

      setTimeLeft(20)
      setIsTransitioning(false)
    }, 300)
  }

  const resetGame = () => {
    setGameState("playing")
    setCurrentTeam("A")
    setTeamAScore(0)
    setTeamBScore(0)
    setCurrentRound(1)
    setCurrentObjectIndex(0)
    setShowConfetti(false)
    setIsTransitioning(false)
    setTimeLeft(20)

    const shuffled = [...gameObjects].sort(() => Math.random() - 0.5)
    setShuffledObjects(shuffled)
  }

  const getWinner = () => {
    if (teamAScore > teamBScore) return "Team A"
    if (teamBScore > teamAScore) return "Team B"
    return "Tie"
  }

  if (gameState === "finished") {
    const winner = getWinner()

    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        )}

        <Card className="p-12 text-center max-w-2xl w-full bg-card border-2 border-primary shadow-2xl">
          <div className="space-y-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-primary">Vega IT Abuja</h3>
              <p className="text-lg text-muted-foreground">Happy Hour</p>
            </div>

            <h1 className="text-6xl font-black text-primary mb-4">🎉 Game Over! 🎉</h1>

            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-foreground">
                {winner === "Tie" ? "It's a Tie!" : `${winner} Wins!`}
              </h2>

              <div className="flex justify-center gap-12 text-2xl font-bold">
                <div
                  className={`p-4 rounded-lg ${teamAScore >= teamBScore ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
                >
                  Team A: {teamAScore}
                </div>
                <div
                  className={`p-4 rounded-lg ${teamBScore >= teamAScore ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
                >
                  Team B: {teamBScore}
                </div>
              </div>
            </div>

            <Button
              onClick={resetGame}
              size="lg"
              className="text-2xl px-12 py-6 bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
            >
              🎮 Play Again
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-primary text-primary-foreground p-6 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-8">
            <div className="text-center">
              <h1 className="text-3xl font-black">Secret Object Game</h1>
              <p className="text-sm opacity-90">Vega IT Abuja - Happy Hour</p>
            </div>
            <div className="text-xl font-bold">
              Round {currentRound} of {maxRounds}
            </div>
          </div>

          <div className="flex gap-8 text-2xl font-black">
            <div
              className={`px-6 py-3 rounded-lg transition-all ${
                currentTeam === "A"
                  ? "bg-accent text-accent-foreground scale-110 shadow-lg"
                  : "bg-primary-foreground/20 text-primary-foreground"
              }`}
            >
              Team A: {teamAScore}
            </div>
            <div
              className={`px-6 py-3 rounded-lg transition-all ${
                currentTeam === "B"
                  ? "bg-accent text-accent-foreground scale-110 shadow-lg"
                  : "bg-primary-foreground/20 text-primary-foreground"
              }`}
            >
              Team B: {teamBScore}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-black text-primary mb-2">
            {currentTeam === "A" ? "🔴" : "🔵"} Team {currentTeam}'s Turn
          </h2>
          <p className="text-xl text-muted-foreground">Can you guess what this object is?</p>

          <div className="mt-4">
            <div
              className={`text-3xl font-bold ${timeLeft <= 7 ? "text-red-500 animate-pulse" : timeLeft <= 12 ? "text-yellow-500" : "text-green-500"}`}
            >
              ⏰ {timeLeft}s
            </div>
            <div className="w-64 h-2 bg-gray-200 rounded-full mx-auto mt-2">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${timeLeft <= 7 ? "bg-red-500" : timeLeft <= 12 ? "bg-yellow-500" : "bg-green-500"}`}
                style={{ width: `${(timeLeft / 20) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div
          className={`transition-all duration-300 ${isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
        >
          <Card className="p-8 bg-card border-2 border-border shadow-xl">
            <div className="text-center space-y-6">
              <img
                src={currentObject.img || "/placeholder.svg"}
                alt="Mystery object"
                className="w-96 h-96 object-contain mx-auto rounded-lg"
              />

              <p className="text-sm text-muted-foreground/60 font-mono">Answer: {currentObject.title}</p>
            </div>
          </Card>
        </div>

        <div className="flex gap-6">
          <Button
            onClick={() => nextTurn(true)}
            size="lg"
            className="text-2xl px-12 py-8 bg-green-500 hover:bg-green-600 text-white font-bold shadow-lg transform hover:scale-105 transition-all"
            disabled={isTransitioning}
          >
            ✅ YES (+1 Point)
          </Button>

          <Button
            onClick={() => nextTurn(false)}
            size="lg"
            className="text-2xl px-12 py-8 bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg transform hover:scale-105 transition-all"
            disabled={isTransitioning}
          >
            ❌ NO (No Points)
          </Button>

          <Button
            onClick={() => nextTurn(false)}
            size="lg"
            className="text-2xl px-12 py-8 bg-blue-500 hover:bg-blue-600 text-white font-bold shadow-lg transform hover:scale-105 transition-all"
            disabled={isTransitioning}
          >
            ⏭️ SKIP
          </Button>
        </div>
      </div>
    </div>
  )
}
