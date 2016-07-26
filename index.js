function getEquipmentArray() {
    var eq = game.equipment;

    return Object.keys(eq).map(function(key) {
        eq[key].name = key;
        return eq[key];
    });
}

function calculateCost(cost, level) {
    return cost[0] * Math.pow(cost[1], level);
}

function calculateWeaponScore(weapon) {
    return weapon.attackCalculated / calculateCost(weapon.cost.metal, weapon.level);
}

function calculateArmorScore(armor) {
    return armor.healthCalculated / calculateCost(armor.cost.metal, armor.level);
}

function isUnlocked(equipment) {
    return equipment.locked == 0;
}

function isWeapon(equipment) {
    return !!equipment.attack;
}

function isArmor(equipment) {
    return !!equipment.health && !equipment.block;
}

function getBestWeapon() {
    return getEquipmentArray().filter(isWeapon).filter(isUnlocked).sort(function(a, b) {
        return calculateWeaponScore(b) - calculateWeaponScore(a);
    })[0];
}

function getBestArmor() {
    return getEquipmentArray().filter(isArmor).filter(isUnlocked).sort(function(a, b) {
        return calculateArmorScore(b) - calculateArmorScore(a);
    })[0];
}

function highlight(id) {
    document.getElementById(id).style.backgroundColor = "#9f9";
}

function unhighlight(id) {
    document.getElementById(id).style.backgroundColor = "inherit";
}

var highlightBestEquipent = (function() {
    var highlighted = [];

    return function() {
        var bestWeapon = getBestWeapon().name;
        var bestArmor = getBestArmor().name;

        highlighted.forEach(unhighlight);
        highlighted.splice(0, highlighted.length);

        highlight(bestWeapon);
        highlight(bestArmor);

        highlighted.push(bestWeapon);
        highlighted.push(bestArmor);
    };
})();

setInterval(highlightBestEquipent, 5000);
