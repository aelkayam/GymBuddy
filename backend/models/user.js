const User = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profile_image: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.ENUM,
      values: ["superAdmin", "admin", "trainer", "user"],
      defaultValue: "user",
    },
    weight: {
      type: DataTypes.FLOAT,
    },
    height: {
      type: DataTypes.FLOAT,
    },
    age: {
      type: DataTypes.INTEGER,
    },
    goal: {
      type: DataTypes.STRING,
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

  User.associate = (models) => {
    User.hasMany(models.Workout, { foreignKey: "user_id" });
    User.hasMany(models.Progress, { foreignKey: "user_id" });
    User.hasMany(models.Message, { foreignKey: "sender_id" });
    User.hasMany(models.Message, { foreignKey: "receiver_id" });
    User.hasMany(models.Goal, { foreignKey: "user_id" });
  };

  return User;
};

export default User;
