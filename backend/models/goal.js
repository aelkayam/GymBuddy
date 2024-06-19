export default (sequelize, DataTypes) => {
  const Goal = sequelize.define("Goal", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type_of_goal: {
      type: DataTypes.ENUM,
      values: ["weight", "strength"],
    },
    target_weight: {
      type: DataTypes.FLOAT,
    },
    target_strength_exercise_id: {
      type: DataTypes.INTEGER,
    },
    target_strength_value: {
      type: DataTypes.FLOAT,
    },
    target_date: {
      type: DataTypes.DATE,
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

  Goal.associate = (models) => {
    Goal.belongsTo(models.User, { foreignKey: "user_id" });
    Goal.belongsTo(models.Exercise, {
      foreignKey: "target_strength_exercise_id",
    });
  };

  return Goal;
};
