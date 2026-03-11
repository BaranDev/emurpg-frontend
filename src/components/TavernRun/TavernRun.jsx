import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { FaDiceD20 } from "react-icons/fa";
import { scenarios } from "../../data/tavern_run_scenarios/scenarioLoader";
import {
  initializeState,
  getCurrentActName,
  getTotalActs,
  getEligibleScenes,
  pickScene,
  rollD20,
  resolveChoice,
  determineEnding,
  getBandLabel,
  getBandColor,
} from "./gameEngine";
import ScenarioSelect from "./ScenarioSelect";
import SceneCard from "./SceneCard";
import EndingScreen from "./EndingScreen";

const PHASE = {
  SELECT: "select",
  CHOOSING: "choosing",
  ROLLING: "rolling",
  RESULT: "result",
  ENDING: "ending",
};

const TavernRun = () => {
  const { t } = useTranslation();

  const [phase, setPhase] = useState(PHASE.SELECT);
  const [scenario, setScenario] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [currentScene, setCurrentScene] = useState(null);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [rollResult, setRollResult] = useState(null);
  const [ending, setEnding] = useState(null);
  const [diceAnimating, setDiceAnimating] = useState(false);

  const startRun = useCallback(
    (s) => {
      const scenarioToUse = s || scenario;
      if (!scenarioToUse) return;
      setScenario(scenarioToUse);
      const state = initializeState(scenarioToUse);
      setGameState(state);
      setRollResult(null);
      setEnding(null);

      const actName = getCurrentActName(0);
      const eligible = getEligibleScenes(scenarioToUse, actName, state);
      const scene = pickScene(eligible);
      setCurrentScene(scene);
      setPhase(PHASE.CHOOSING);
    },
    [scenario],
  );

  const handleScenarioSelect = useCallback(
    (s) => {
      startRun(s);
    },
    [startRun],
  );

  const handleChoiceSelect = useCallback((choice) => {
    setSelectedChoice(choice);
    setPhase(PHASE.ROLLING);
  }, []);

  const handleRoll = useCallback(() => {
    if (!selectedChoice || !gameState || !scenario) return;

    setDiceAnimating(true);
    const roll = rollD20();
    const result = resolveChoice(selectedChoice, roll, gameState);

    // Brief animation delay
    setTimeout(() => {
      setDiceAnimating(false);
      setRollResult(result);
      setGameState(result.newState);
      setPhase(PHASE.RESULT);
    }, 600);
  }, [selectedChoice, gameState, scenario]);

  const handleContinue = useCallback(() => {
    if (!gameState || !scenario) return;

    const actIndex = gameState.currentActIndex;

    if (actIndex >= getTotalActs()) {
      // Game over, determine ending
      const end = determineEnding(scenario, gameState);
      setEnding(end);
      setPhase(PHASE.ENDING);
      return;
    }

    const actName = getCurrentActName(actIndex);
    const eligible = getEligibleScenes(scenario, actName, gameState);
    const scene = pickScene(eligible);

    if (!scene) {
      // No eligible scenes, end the run
      const end = determineEnding(scenario, gameState);
      setEnding(end);
      setPhase(PHASE.ENDING);
      return;
    }

    setCurrentScene(scene);
    setSelectedChoice(null);
    setRollResult(null);
    setPhase(PHASE.CHOOSING);
  }, [gameState, scenario]);

  const handleRestart = useCallback(() => {
    startRun(scenario);
  }, [scenario, startRun]);

  const handleChangeScenario = useCallback(() => {
    setPhase(PHASE.SELECT);
    setScenario(null);
    setGameState(null);
    setCurrentScene(null);
    setSelectedChoice(null);
    setRollResult(null);
    setEnding(null);
  }, []);

  // --- Stat bar ---
  const renderStats = () => {
    if (!gameState) return null;
    return (
      <div className="flex justify-center gap-3 mb-4 text-xs">
        <span className="bg-gray-700/60 px-2 py-1 rounded text-yellow-400">
          {t("tavern_run.stat_renown")}: {gameState.renown}
        </span>
        <span className="bg-gray-700/60 px-2 py-1 rounded text-green-400">
          {t("tavern_run.stat_supplies")}: {gameState.supplies}
        </span>
        <span className="bg-gray-700/60 px-2 py-1 rounded text-red-400">
          {t("tavern_run.stat_danger")}: {gameState.danger}
        </span>
        {gameState.streak > 0 && (
          <span className="bg-gray-700/60 px-2 py-1 rounded text-blue-400">
            {t("tavern_run.stat_streak")}: {gameState.streak}
          </span>
        )}
      </div>
    );
  };

  // --- Dice button ---
  const renderDiceButton = () => (
    <div className="text-center my-4">
      <button
        onClick={handleRoll}
        disabled={diceAnimating}
        className={`text-6xl text-yellow-500 rounded-full p-4 border-2 border-yellow-500/50 bg-transparent hover:bg-transparent hover:text-yellow-400 hover:border-yellow-400 hover:shadow-[0_0px_35px_5px_rgba(255,255,153,0.10)] transition-all duration-300 disabled:opacity-50 ${diceAnimating ? "animate-spin" : ""}`}
      >
        <FaDiceD20 size={64} />
      </button>
      <p className="text-gray-500 text-xs mt-2">
        {t("tavern_run.tap_to_roll")}
      </p>
    </div>
  );

  // --- Result display ---
  const renderResult = () => {
    if (!rollResult) return null;
    const bandLabel = getBandLabel(rollResult.band);
    const bandColor = getBandColor(rollResult.band);

    return (
      <div className="max-w-md mx-auto animate-fadeIn">
        <div className="bg-gray-800/80 border border-yellow-500/30 rounded-xl p-5 text-center">
          {/* Roll value */}
          <div className="text-5xl font-bold text-yellow-400 mb-1">
            {rollResult.roll}
          </div>
          <div className={`text-sm font-bold mb-3 ${bandColor}`}>
            {bandLabel}
          </div>

          {/* Result text */}
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            {rollResult.result.text}
          </p>

          {/* Stat changes */}
          {rollResult.result.statChanges &&
            Object.keys(rollResult.result.statChanges).length > 0 && (
              <div className="flex justify-center gap-2 mb-4 flex-wrap">
                {Object.entries(rollResult.result.statChanges).map(
                  ([key, val]) => (
                    <span
                      key={key}
                      className={`text-xs px-2 py-1 rounded ${val > 0 ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"}`}
                    >
                      {key} {val > 0 ? "+" : ""}
                      {val}
                    </span>
                  ),
                )}
              </div>
            )}

          {/* Continue */}
          <button
            onClick={handleContinue}
            className="px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-gray-900 font-bold rounded-lg transition-colors duration-300"
          >
            {gameState.currentActIndex >= getTotalActs()
              ? t("tavern_run.see_fate")
              : t("tavern_run.continue")}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="py-4 px-4">
      {/* Scenario select */}
      {phase === PHASE.SELECT && (
        <ScenarioSelect scenarios={scenarios} onSelect={handleScenarioSelect} />
      )}

      {/* Active game */}
      {(phase === PHASE.CHOOSING ||
        phase === PHASE.ROLLING ||
        phase === PHASE.RESULT) && (
        <>
          {renderStats()}

          {phase === PHASE.CHOOSING && currentScene && (
            <SceneCard
              scene={currentScene}
              actIndex={gameState.currentActIndex}
              onChoiceSelect={handleChoiceSelect}
              disabled={false}
            />
          )}

          {phase === PHASE.ROLLING && (
            <>
              {currentScene && (
                <SceneCard
                  scene={currentScene}
                  actIndex={gameState.currentActIndex}
                  onChoiceSelect={() => {}}
                  disabled={true}
                />
              )}
              {renderDiceButton()}
            </>
          )}

          {phase === PHASE.RESULT && renderResult()}
        </>
      )}

      {/* Ending */}
      {phase === PHASE.ENDING && ending && gameState && (
        <EndingScreen
          ending={ending}
          state={gameState}
          scenarioName={scenario.name}
          onRestart={handleRestart}
          onChangeScenario={handleChangeScenario}
        />
      )}
    </div>
  );
};

TavernRun.propTypes = {};

export default TavernRun;
