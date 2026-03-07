const ACT_ORDER = ["hook", "complication", "opportunity", "crisis"];

export function initializeState(scenario) {
  return {
    renown: scenario.startingState.renown ?? 0,
    supplies: scenario.startingState.supplies ?? 2,
    danger: scenario.startingState.danger ?? 1,
    streak: scenario.startingState.streak ?? 0,
    tags: [...(scenario.startingState.tags || [])],
    currentActIndex: 0,
    sceneHistory: [],
  };
}

export function getCurrentActName(actIndex) {
  if (actIndex >= ACT_ORDER.length) return null;
  return ACT_ORDER[actIndex];
}

export function getTotalActs() {
  return ACT_ORDER.length;
}

export function getEligibleScenes(scenario, actName, state) {
  const scenes = scenario.acts[actName] || [];
  return scenes.filter((scene) => {
    if (state.sceneHistory.includes(scene.id)) return false;
    const req = scene.requirements || {};
    const required = req.requiredTags || [];
    const excluded = req.excludedTags || [];
    if (required.length > 0 && !required.some((t) => state.tags.includes(t))) {
      return false;
    }
    if (excluded.some((t) => state.tags.includes(t))) return false;
    return true;
  });
}

export function pickScene(eligibleScenes) {
  if (!eligibleScenes.length) return null;
  return eligibleScenes[Math.floor(Math.random() * eligibleScenes.length)];
}

export function rollD20() {
  return Math.floor(Math.random() * 20) + 1;
}

export function getRollBand(roll) {
  if (roll === 1) return "critFail";
  if (roll <= 6) return "fail";
  if (roll <= 14) return "mixed";
  if (roll <= 19) return "success";
  return "crit";
}

export function resolveChoice(choice, roll, state) {
  const band = getRollBand(roll);
  const result = choice.rollTable[band];

  const newState = {
    ...state,
    tags: [...state.tags],
    sceneHistory: [...state.sceneHistory],
  };

  if (result.statChanges) {
    Object.entries(result.statChanges).forEach(([key, val]) => {
      if (key in newState) {
        newState[key] = (newState[key] || 0) + val;
      }
    });
  }

  if (result.addTags) {
    result.addTags.forEach((tag) => {
      if (!newState.tags.includes(tag)) newState.tags.push(tag);
    });
  }
  if (result.removeTags) {
    newState.tags = newState.tags.filter(
      (t) => !result.removeTags.includes(t),
    );
  }

  if (band === "success" || band === "crit") {
    newState.streak = (state.streak || 0) + 1;
  } else {
    newState.streak = 0;
  }

  newState.currentActIndex = state.currentActIndex + 1;

  return { result, newState, band, roll };
}

export function determineEnding(scenario, state) {
  const scored = scenario.endings.map((ending) => {
    const req = ending.requirements || {};
    let score = 0;
    let disqualified = false;

    // Hard filters
    if (req.requiredTags && req.requiredTags.length > 0) {
      const matched = req.requiredTags.filter((t) => state.tags.includes(t));
      if (matched.length === 0) disqualified = true;
      score += matched.length * 2;
    }
    if (req.excludedTags) {
      if (req.excludedTags.some((t) => state.tags.includes(t))) {
        disqualified = true;
      }
    }

    // Soft scoring
    if (req.minRenown != null && state.renown >= req.minRenown) score += 1;
    if (req.maxRenown != null && state.renown <= req.maxRenown) score += 1;
    if (req.minSupplies != null && state.supplies >= req.minSupplies) score += 1;
    if (req.maxSupplies != null && state.supplies <= req.maxSupplies) score += 1;
    if (req.minDanger != null && state.danger >= req.minDanger) score += 1;
    if (req.minStreak != null && state.streak >= req.minStreak) score += 1;

    return { ending, score, disqualified };
  });

  // Prefer non-disqualified endings with highest score
  const eligible = scored.filter((s) => !s.disqualified);
  const pool = eligible.length > 0 ? eligible : scored;
  pool.sort((a, b) => b.score - a.score);

  const topScore = pool[0].score;
  const candidates = pool.filter((s) => s.score >= topScore - 1);
  return candidates[Math.floor(Math.random() * candidates.length)].ending;
}

export function getBandLabel(band) {
  const labels = {
    critFail: "Critical Fail!",
    fail: "Failure",
    mixed: "Mixed Result",
    success: "Success!",
    crit: "NATURAL 20!",
  };
  return labels[band] || band;
}

export function getBandColor(band) {
  const colors = {
    critFail: "text-red-500",
    fail: "text-orange-400",
    mixed: "text-yellow-300",
    success: "text-green-400",
    crit: "text-yellow-400",
  };
  return colors[band] || "text-gray-300";
}
