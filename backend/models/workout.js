export default (sequelize, DataTypes) => {
  const Workout = sequelize.define("Workout", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    trainer_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    difficulty: {
      type: DataTypes.ENUM,
      values: ["beginner", "intermediate", "advanced"],
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

  Workout.associate = (models) => {
    Workout.belongsTo(models.User, { foreignKey: "user_id" });
    Workout.belongsTo(models.User, { foreignKey: "trainer_id", as: "trainer" });
    Workout.hasMany(models.Progress, { foreignKey: "workout_id" });
    Workout.hasMany(models.WorkoutExercise, { foreignKey: "workout_id" });
  };

  return Workout;
};
