import { createClient } from "./index";

const exercisesData = [
  // Bodyweight - Upper Body
  {
    name: "Push-ups",
    instructions:
      "Start in a plank position with hands shoulder-width apart. Lower your body until chest nearly touches the floor, then push back up.",
    muscleGroups: ["chest", "shoulders", "triceps", "core"],
    difficulty: "beginner" as const,
    equipment: "bodyweight" as const,
    formTips:
      "Keep your body in a straight line from head to heels. Don't let your hips sag or pike up.",
  },
  {
    name: "Pull-ups",
    instructions:
      "Hang from a bar with palms facing away. Pull yourself up until chin is above the bar, then lower with control.",
    muscleGroups: ["back", "biceps", "shoulders"],
    difficulty: "intermediate" as const,
    equipment: "pull_up_bar" as const,
    formTips:
      "Engage your core and avoid swinging. Focus on pulling with your back muscles.",
  },
  {
    name: "Diamond Push-ups",
    instructions:
      "Form a diamond shape with your hands under your chest. Perform push-ups with elbows close to your sides.",
    muscleGroups: ["triceps", "chest", "shoulders"],
    difficulty: "intermediate" as const,
    equipment: "bodyweight" as const,
    formTips: "Keep elbows tucked in close to your body throughout the movement.",
  },
  {
    name: "Dips",
    instructions:
      "Support yourself on parallel bars or bench. Lower body by bending elbows to 90 degrees, then push back up.",
    muscleGroups: ["triceps", "chest", "shoulders"],
    difficulty: "intermediate" as const,
    equipment: "bench" as const,
    formTips: "Lean forward slightly for chest emphasis, stay upright for triceps focus.",
  },
  {
    name: "Pike Push-ups",
    instructions:
      "Start in downward dog position. Bend elbows to lower your head toward the ground, then push back up.",
    muscleGroups: ["shoulders", "triceps", "upper chest"],
    difficulty: "intermediate" as const,
    equipment: "bodyweight" as const,
    formTips: "Keep your hips high and core engaged throughout the movement.",
  },

  // Bodyweight - Lower Body
  {
    name: "Squats",
    instructions:
      "Stand with feet shoulder-width apart. Lower your hips back and down as if sitting in a chair, then stand back up.",
    muscleGroups: ["quads", "glutes", "hamstrings"],
    difficulty: "beginner" as const,
    equipment: "bodyweight" as const,
    formTips:
      "Keep your chest up, knees tracking over toes, and weight in your heels.",
  },
  {
    name: "Lunges",
    instructions:
      "Step forward with one leg and lower your hips until both knees are at 90 degrees. Push back to starting position.",
    muscleGroups: ["quads", "glutes", "hamstrings"],
    difficulty: "beginner" as const,
    equipment: "bodyweight" as const,
    formTips: "Keep your front knee over your ankle and torso upright.",
  },
  {
    name: "Jump Squats",
    instructions:
      "Perform a squat, then explode upward jumping as high as possible. Land softly and immediately go into next rep.",
    muscleGroups: ["quads", "glutes", "hamstrings", "calves"],
    difficulty: "intermediate" as const,
    equipment: "bodyweight" as const,
    formTips: "Land softly with bent knees to absorb impact. Maintain good squat form.",
  },
  {
    name: "Bulgarian Split Squats",
    instructions:
      "Place rear foot on bench behind you. Lower down into a lunge position on front leg, then push back up.",
    muscleGroups: ["quads", "glutes", "hamstrings"],
    difficulty: "intermediate" as const,
    equipment: "bench" as const,
    formTips: "Keep your front knee tracking over your toes and torso upright.",
  },
  {
    name: "Single-leg Deadlifts",
    instructions:
      "Stand on one leg. Hinge at hips while extending other leg back, keeping back straight. Return to standing.",
    muscleGroups: ["hamstrings", "glutes", "lower back", "core"],
    difficulty: "intermediate" as const,
    equipment: "bodyweight" as const,
    formTips: "Focus on balance and keeping your back straight throughout.",
  },
  {
    name: "Glute Bridges",
    instructions:
      "Lie on back with knees bent and feet flat. Lift hips up by squeezing glutes, then lower back down.",
    muscleGroups: ["glutes", "hamstrings", "lower back"],
    difficulty: "beginner" as const,
    equipment: "bodyweight" as const,
    formTips: "Squeeze glutes at the top and keep core engaged.",
  },
  {
    name: "Wall Sits",
    instructions:
      "Lean back against wall with knees at 90 degrees as if sitting in chair. Hold this position.",
    muscleGroups: ["quads", "glutes"],
    difficulty: "beginner" as const,
    equipment: "bodyweight" as const,
    formTips: "Keep your back flat against the wall and breathe steadily.",
  },
  {
    name: "Calf Raises",
    instructions:
      "Stand with feet hip-width apart. Rise up onto the balls of your feet, then lower back down.",
    muscleGroups: ["calves"],
    difficulty: "beginner" as const,
    equipment: "bodyweight" as const,
    formTips:
      "Control the movement in both directions. Can be done on a step for greater range.",
  },

  // Bodyweight - Core
  {
    name: "Plank",
    instructions:
      "Hold a push-up position with forearms on the ground. Keep body in a straight line from head to heels.",
    muscleGroups: ["core", "shoulders"],
    difficulty: "beginner" as const,
    equipment: "bodyweight" as const,
    formTips: "Don't let hips sag or pike up. Breathe steadily.",
  },
  {
    name: "Mountain Climbers",
    instructions:
      "Start in plank position. Alternately drive knees toward chest in a running motion.",
    muscleGroups: ["core", "shoulders", "cardio"],
    difficulty: "intermediate" as const,
    equipment: "bodyweight" as const,
    formTips: "Keep hips level and core tight throughout the movement.",
  },
  {
    name: "Russian Twists",
    instructions:
      "Sit with knees bent and feet off ground. Rotate torso side to side, touching ground next to hips.",
    muscleGroups: ["obliques", "core"],
    difficulty: "beginner" as const,
    equipment: "bodyweight" as const,
    formTips: "Keep your back straight and rotate from the torso, not just arms.",
  },
  {
    name: "Bicycle Crunches",
    instructions:
      "Lie on back with hands behind head. Bring opposite elbow to opposite knee in a pedaling motion.",
    muscleGroups: ["core", "obliques"],
    difficulty: "beginner" as const,
    equipment: "bodyweight" as const,
    formTips:
      "Focus on rotation and controlled movement rather than speed.",
  },
  {
    name: "Leg Raises",
    instructions:
      "Lie flat on back with legs straight. Raise legs up to 90 degrees, then lower with control.",
    muscleGroups: ["lower abs", "hip flexors"],
    difficulty: "intermediate" as const,
    equipment: "bodyweight" as const,
    formTips: "Keep lower back pressed to the floor and control the descent.",
  },
  {
    name: "Side Plank",
    instructions:
      "Lie on side with elbow under shoulder. Lift hips off ground to form straight line from head to feet.",
    muscleGroups: ["obliques", "core", "shoulders"],
    difficulty: "intermediate" as const,
    equipment: "bodyweight" as const,
    formTips: "Keep hips lifted and body in a straight line. Don't let hips sag.",
  },

  // Dumbbell - Upper Body
  {
    name: "Dumbbell Bench Press",
    instructions:
      "Lie on bench with dumbbells at chest level. Press weights up until arms are extended, then lower with control.",
    muscleGroups: ["chest", "shoulders", "triceps"],
    difficulty: "beginner" as const,
    equipment: "dumbbells" as const,
    formTips:
      "Keep feet flat on floor and maintain natural arch in lower back.",
  },
  {
    name: "Dumbbell Rows",
    instructions:
      "Hinge forward at hips with one hand on bench. Row dumbbell up to hip, squeezing shoulder blade back.",
    muscleGroups: ["back", "biceps", "rear delts"],
    difficulty: "beginner" as const,
    equipment: "dumbbells" as const,
    formTips: "Keep your back flat and pull with your elbow, not your hand.",
  },
  {
    name: "Dumbbell Shoulder Press",
    instructions:
      "Stand or sit with dumbbells at shoulder height. Press weights overhead until arms are extended.",
    muscleGroups: ["shoulders", "triceps", "upper chest"],
    difficulty: "beginner" as const,
    equipment: "dumbbells" as const,
    formTips: "Keep core tight and don't arch your lower back excessively.",
  },
  {
    name: "Dumbbell Bicep Curls",
    instructions:
      "Stand with dumbbells at sides, palms forward. Curl weights up to shoulders, then lower with control.",
    muscleGroups: ["biceps"],
    difficulty: "beginner" as const,
    equipment: "dumbbells" as const,
    formTips:
      "Keep elbows stationary at your sides and avoid swinging the weights.",
  },
  {
    name: "Dumbbell Tricep Extensions",
    instructions:
      "Hold one dumbbell overhead with both hands. Lower behind head by bending elbows, then extend back up.",
    muscleGroups: ["triceps"],
    difficulty: "beginner" as const,
    equipment: "dumbbells" as const,
    formTips: "Keep elbows pointed forward and close to your head.",
  },
  {
    name: "Dumbbell Lateral Raises",
    instructions:
      "Stand with dumbbells at sides. Raise arms out to sides until parallel with ground, then lower.",
    muscleGroups: ["shoulders", "lateral delts"],
    difficulty: "beginner" as const,
    equipment: "dumbbells" as const,
    formTips: "Use controlled movement and don't swing the weights up.",
  },
  {
    name: "Dumbbell Front Raises",
    instructions:
      "Stand with dumbbells in front of thighs. Raise weights forward to shoulder height, then lower.",
    muscleGroups: ["shoulders", "front delts"],
    difficulty: "beginner" as const,
    equipment: "dumbbells" as const,
    formTips: "Keep arms straight and core engaged. Avoid using momentum.",
  },
  {
    name: "Dumbbell Chest Flyes",
    instructions:
      "Lie on bench with dumbbells above chest. Lower weights out to sides in arc motion, then bring back together.",
    muscleGroups: ["chest", "shoulders"],
    difficulty: "intermediate" as const,
    equipment: "dumbbells" as const,
    formTips: "Maintain slight bend in elbows and feel stretch in chest.",
  },

  // Dumbbell - Lower Body
  {
    name: "Dumbbell Goblet Squats",
    instructions:
      "Hold one dumbbell at chest level. Perform a squat, keeping the weight close to your body.",
    muscleGroups: ["quads", "glutes", "core"],
    difficulty: "beginner" as const,
    equipment: "dumbbells" as const,
    formTips: "Keep chest up and weight in your heels throughout.",
  },
  {
    name: "Dumbbell Romanian Deadlifts",
    instructions:
      "Hold dumbbells in front of thighs. Hinge at hips while keeping back straight, then return to standing.",
    muscleGroups: ["hamstrings", "glutes", "lower back"],
    difficulty: "intermediate" as const,
    equipment: "dumbbells" as const,
    formTips:
      "Keep dumbbells close to legs and maintain slight bend in knees.",
  },
  {
    name: "Dumbbell Lunges",
    instructions:
      "Hold dumbbells at sides. Step forward into lunge position, then push back to standing.",
    muscleGroups: ["quads", "glutes", "hamstrings"],
    difficulty: "beginner" as const,
    equipment: "dumbbells" as const,
    formTips: "Keep torso upright and front knee tracking over ankle.",
  },
  {
    name: "Dumbbell Step-ups",
    instructions:
      "Hold dumbbells at sides. Step up onto bench with one foot, then step back down.",
    muscleGroups: ["quads", "glutes"],
    difficulty: "intermediate" as const,
    equipment: "dumbbells" as const,
    formTips: "Push through heel of elevated foot and keep chest up.",
  },

  // Kettlebell Exercises
  {
    name: "Kettlebell Swings",
    instructions:
      "Stand with feet wide, kettlebell between legs. Hinge at hips and swing kettlebell up to shoulder height.",
    muscleGroups: ["glutes", "hamstrings", "core", "shoulders"],
    difficulty: "intermediate" as const,
    equipment: "kettlebell" as const,
    formTips: "Power comes from hip thrust, not arms. Keep back straight.",
  },
  {
    name: "Kettlebell Goblet Squats",
    instructions:
      "Hold kettlebell at chest by horns. Squat down keeping weight at chest, then stand back up.",
    muscleGroups: ["quads", "glutes", "core"],
    difficulty: "beginner" as const,
    equipment: "kettlebell" as const,
    formTips:
      "Keep elbows inside knees at bottom and maintain upright torso.",
  },
  {
    name: "Kettlebell Turkish Get-ups",
    instructions:
      "Lie on back with kettlebell extended overhead. Rise to standing while keeping weight overhead, then reverse.",
    muscleGroups: ["core", "shoulders", "legs", "full body"],
    difficulty: "advanced" as const,
    equipment: "kettlebell" as const,
    formTips:
      "Move slowly and deliberately. Keep eyes on kettlebell throughout.",
  },
  {
    name: "Kettlebell Windmills",
    instructions:
      "Hold kettlebell overhead. Hinge at hip and reach other hand toward floor while maintaining overhead arm.",
    muscleGroups: ["core", "shoulders", "obliques"],
    difficulty: "advanced" as const,
    equipment: "kettlebell" as const,
    formTips: "Keep overhead arm locked out and eyes on the kettlebell.",
  },

  // Resistance Band Exercises
  {
    name: "Band Pull-aparts",
    instructions:
      "Hold band at chest height with arms extended. Pull band apart by moving arms out to sides.",
    muscleGroups: ["rear delts", "upper back"],
    difficulty: "beginner" as const,
    equipment: "bands" as const,
    formTips: "Keep arms straight and squeeze shoulder blades together.",
  },
  {
    name: "Band Face Pulls",
    instructions:
      "Attach band at head height. Pull band toward face, separating hands at the end.",
    muscleGroups: ["rear delts", "traps", "upper back"],
    difficulty: "beginner" as const,
    equipment: "bands" as const,
    formTips: "Keep elbows high and focus on pulling band to face level.",
  },
  {
    name: "Band Chest Press",
    instructions:
      "Anchor band behind you at chest height. Press handles forward until arms are extended.",
    muscleGroups: ["chest", "shoulders", "triceps"],
    difficulty: "beginner" as const,
    equipment: "bands" as const,
    formTips: "Keep core tight and control the return phase.",
  },
  {
    name: "Band Rows",
    instructions:
      "Anchor band at chest height. Pull handles toward chest, squeezing shoulder blades together.",
    muscleGroups: ["back", "biceps", "rear delts"],
    difficulty: "beginner" as const,
    equipment: "bands" as const,
    formTips: "Keep elbows close to body and pull with your back, not arms.",
  },

  // Cardio / Full Body
  {
    name: "Burpees",
    instructions:
      "Drop to plank, do a push-up, jump feet to hands, then jump up with arms overhead.",
    muscleGroups: ["full body", "cardio"],
    difficulty: "intermediate" as const,
    equipment: "bodyweight" as const,
    formTips: "Move quickly but maintain good form on each component.",
  },
  {
    name: "High Knees",
    instructions:
      "Run in place while driving knees up to hip height as quickly as possible.",
    muscleGroups: ["cardio", "hip flexors", "quads"],
    difficulty: "beginner" as const,
    equipment: "bodyweight" as const,
    formTips:
      "Stay on balls of feet and pump arms to maintain quick tempo.",
  },
  {
    name: "Jumping Jacks",
    instructions:
      "Jump feet wide while raising arms overhead, then jump back to starting position.",
    muscleGroups: ["cardio", "shoulders", "legs"],
    difficulty: "beginner" as const,
    equipment: "bodyweight" as const,
    formTips: "Land softly and maintain steady rhythm.",
  },
  {
    name: "Box Jumps",
    instructions:
      "Stand facing a box. Jump onto box landing softly, then step back down.",
    muscleGroups: ["legs", "glutes", "cardio"],
    difficulty: "intermediate" as const,
    equipment: "box" as const,
    formTips: "Land softly with bent knees and fully extend hips at top.",
  },
  {
    name: "Battle Ropes",
    instructions:
      "Hold ends of heavy ropes. Create waves by alternating or simultaneously moving arms up and down.",
    muscleGroups: ["shoulders", "core", "cardio"],
    difficulty: "intermediate" as const,
    equipment: "none" as const,
    formTips: "Keep knees slightly bent and core engaged throughout.",
  },

  // TRX / Suspension Training
  {
    name: "TRX Rows",
    instructions:
      "Hold TRX handles, lean back with body straight. Pull body up by bending elbows.",
    muscleGroups: ["back", "biceps", "core"],
    difficulty: "intermediate" as const,
    equipment: "trx" as const,
    formTips: "Keep body in straight line and squeeze shoulder blades.",
  },
  {
    name: "TRX Push-ups",
    instructions:
      "Hold TRX handles in push-up position. Perform push-ups with suspended hands.",
    muscleGroups: ["chest", "shoulders", "triceps", "core"],
    difficulty: "intermediate" as const,
    equipment: "trx" as const,
    formTips: "Engage core to maintain stability throughout movement.",
  },
  {
    name: "TRX Pike",
    instructions:
      "Place feet in TRX straps in plank position. Pull hips up toward ceiling into pike position.",
    muscleGroups: ["core", "shoulders", "hip flexors"],
    difficulty: "advanced" as const,
    equipment: "trx" as const,
    formTips: "Keep legs straight and control the movement in both directions.",
  },

  // Medicine Ball
  {
    name: "Medicine Ball Slams",
    instructions:
      "Hold ball overhead. Forcefully slam ball to ground, catch rebound, and repeat.",
    muscleGroups: ["core", "shoulders", "back", "cardio"],
    difficulty: "intermediate" as const,
    equipment: "medicine_ball" as const,
    formTips: "Use your entire body and abs to generate force.",
  },
  {
    name: "Medicine Ball Russian Twists",
    instructions:
      "Sit with knees bent holding medicine ball. Rotate torso side to side, touching ball to ground.",
    muscleGroups: ["obliques", "core"],
    difficulty: "intermediate" as const,
    equipment: "medicine_ball" as const,
    formTips: "Keep back straight and rotate from the torso.",
  },

  // Barbell Exercises
  {
    name: "Barbell Back Squats",
    instructions:
      "Position barbell on upper back. Squat down until thighs are parallel to ground, then stand.",
    muscleGroups: ["quads", "glutes", "hamstrings", "core"],
    difficulty: "intermediate" as const,
    equipment: "barbell" as const,
    formTips:
      "Keep chest up, core tight, and knees tracking over toes.",
  },
  {
    name: "Barbell Deadlifts",
    instructions:
      "Stand with feet under barbell. Hinge at hips to grip bar, then lift by extending hips and knees.",
    muscleGroups: ["back", "glutes", "hamstrings", "traps"],
    difficulty: "intermediate" as const,
    equipment: "barbell" as const,
    formTips: "Keep bar close to body and back straight throughout.",
  },
  {
    name: "Barbell Bench Press",
    instructions:
      "Lie on bench with barbell above chest. Lower bar to chest, then press back up.",
    muscleGroups: ["chest", "shoulders", "triceps"],
    difficulty: "intermediate" as const,
    equipment: "barbell" as const,
    formTips: "Keep feet flat and maintain natural arch in lower back.",
  },
  {
    name: "Barbell Bent Over Rows",
    instructions:
      "Hinge forward at hips holding barbell. Pull bar to lower chest, then lower with control.",
    muscleGroups: ["back", "biceps", "rear delts"],
    difficulty: "intermediate" as const,
    equipment: "barbell" as const,
    formTips: "Keep back flat and pull with elbows, not hands.",
  },
];

export async function seedExercises() {
  try {
    console.log("Starting exercise seed...");

    const supabase = await createClient();

    // Convert camelCase to snake_case for database columns
    const formattedExercises = exercisesData.map((exercise) => ({
      name: exercise.name,
      instructions: exercise.instructions,
      muscle_groups: exercise.muscleGroups,
      difficulty: exercise.difficulty,
      equipment: exercise.equipment,
      form_tips: exercise.formTips,
    }));

    // Use upsert to insert exercises, ignoring duplicates based on name
    const { error } = await supabase
      .from("exercises")
      .upsert(formattedExercises, { onConflict: "name", ignoreDuplicates: true });

    if (error) throw error;

    console.log(`Successfully seeded ${exercisesData.length} exercises!`);
  } catch (error) {
    console.error("Error seeding exercises:", error);
    throw error;
  }
}

// Run seed if called directly
if (require.main === module) {
  seedExercises()
    .then(() => {
      console.log("Seed completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seed failed:", error);
      process.exit(1);
    });
}
