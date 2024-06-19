export default (sequelize, DataTypes) => {
  const Progress = sequelize.define("Progress", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    workout_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    progress_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM,
      values: ["completed", "missed"],
      allowNull: false,
    },
    notes: {
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

  Progress.associate = (models) => {
    Progress.belongsTo(models.User, { foreignKey: "user_id" });
    Progress.belongsTo(models.Workout, { foreignKey: "workout_id" });
  };

  return Progress;
};
