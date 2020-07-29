module.exports = function (sequelize, DataTypes) {
    var Categories = sequelize.define("Categories", {
        name: DataTypes.STRING,
        budget: DataTypes.DECIMAL(10,2),
        budgetUsed: DataTypes.DECIMAL(10,2),
    });

    Categories.associate = function (models) {

        Categories.belongsTo(models.Users, {
            foreignKey: "categoryID", //???
            allowNull: false

        });
    };

    return Categories;
};