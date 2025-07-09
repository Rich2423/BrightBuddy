import React, { useState } from 'react';

export type StoryScene = {
  id: string;
  text: string;
  choices: { text: string; next: string }[];
  question?: {
    type: 'multiple-choice' | 'open-ended';
    prompt: string;
    options?: string[];
    answer?: string;
  };
};

export type Story = {
  title: string;
  scenes: StoryScene[];
};

type StoryPlayerProps = {
  story: Story;
  onComplete?: () => void;
};

export default function StoryPlayer({ story, onComplete }: StoryPlayerProps) {
  const [sceneId, setSceneId] = useState(story.scenes[0].id);
  const scene = story.scenes.find((s) => s.id === sceneId);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleChoice = (choice: { text: string; next: string }) => {
    setFeedback(null);
    setSelectedOption(null);
    setSceneId(choice.next);
    if (choice.next === 'end' && onComplete) onComplete();
  };

  const handleAnswer = (option: string) => {
    setSelectedOption(option);
    if (scene?.question?.answer) {
      if (option === scene.question.answer) {
        setFeedback('Correct!');
      } else {
        setFeedback('Try again or ask for a hint!');
      }
    }
  };

  if (!scene) return <div>Story scene not found.</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <h1 className="text-2xl font-bold mb-4">{story.title}</h1>
      <div className="mb-6 text-lg">{scene.text}</div>
      {scene.question && (
        <div className="mb-4">
          <div className="font-semibold mb-2">{scene.question.prompt}</div>
          {scene.question.type === 'multiple-choice' && scene.question.options && (
            <div className="flex flex-col gap-2">
              {scene.question.options.map((option) => (
                <button
                  key={option}
                  className={`btn ${selectedOption === option ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => handleAnswer(option)}
                  disabled={!!feedback && option !== scene.question?.answer}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
          {feedback && <div className="mt-2 text-green-600">{feedback}</div>}
        </div>
      )}
      <div className="flex flex-col gap-2">
        {scene.choices.map((choice) => (
          <button
            key={choice.text}
            className="btn btn-outline"
            onClick={() => handleChoice(choice)}
          >
            {choice.text}
          </button>
        ))}
        {scene.choices.length === 0 && (
          <div className="text-gray-500 mt-4">The End</div>
        )}
      </div>
    </div>
  );
} 