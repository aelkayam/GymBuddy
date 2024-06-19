module.exports = (sequelize, DataTypes) => {
  const Exercise = sequelize.define("Exercise", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    muscle_groups: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
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

  Exercise.associate = (models) => {
    Exercise.hasMany(models.WorkoutExercise, { foreignKey: "exercise_id" });
    Exercise.hasMany(models.Goal, {
      foreignKey: "target_strength_exercise_id",
    });
  };

  return Exercise;
};
