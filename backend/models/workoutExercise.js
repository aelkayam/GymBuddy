export default (sequelize, DataTypes) => {
  const WorkoutExercise = sequelize.define("WorkoutExercise", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    workout_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    exercise_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sets: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    repetitions: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rest_time: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  WorkoutExercise.associate = (models) => {
    WorkoutExercise.belongsTo(models.Workout, { foreignKey: "workout_id" });
    WorkoutExercise.belongsTo(models.Exercise, { foreignKey: "exercise_id" });
  };

  return WorkoutExercise;
};
