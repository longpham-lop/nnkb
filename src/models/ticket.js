import { DataTypes } from "sequelize";

const Ticket = (sequelize) => {
    return sequelize.define("Ticket", {
        eventName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        buyer: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        nftTokenId: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });
};

export default Ticket;
