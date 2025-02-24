function triangle(
  value1: number, type1: string,
  value2: number, type2: string
): string {
    console.log("Usage: triangle(value1, type1, value2, type2)");
    console.log("Types: leg, hypotenuse, adjacent angle, opposite angle, angle");

    type1 = type1.toLowerCase();
    type2 = type2.toLowerCase();
    
    if (value1 <= 0 || value2 <= 0) {
        console.log("Error: Values must be positive numbers.");
        return "failed";
    }
    
    let a: number = 0, b: number = 0, c: number = 0;
    let alpha: number = 0, beta: number = 0;
    
    if (type1 === "leg" && type2 === "leg") {
        a = value1;
        b = value2;
        c = Math.sqrt(a * a + b * b);
        alpha = Math.atan(a / b) * (180 / Math.PI);
        beta = 90 - alpha;
    } else if (type1 === "leg" && type2 === "hypotenuse" || type1 === "hypotenuse" && type2 === "leg") {
        c = type1 === "hypotenuse" ? value1 : value2;
        a = type1 === "leg" ? value1 : value2;
        if (a >= c) {
            console.log("Error: Leg must be smaller than hypotenuse.");
            return "failed";
        }
        b = Math.sqrt(c * c - a * a);
        alpha = Math.asin(a / c) * (180 / Math.PI);
        beta = 90 - alpha;
    } else if (type1.includes("angle") && type2 === "leg" || type1 === "leg" && type2.includes("angle")) {
        let angle = type1.includes("angle") ? value1 : value2;
        a = type1 === "leg" ? value1 : value2;
        if (angle <= 0 || angle >= 90) {
            console.log("Error: Angles must be between 0 and 90 degrees.");
            return "failed";
        }
        let angleRad = angle * (Math.PI / 180);
        b = a / Math.tan(angleRad);
        c = Math.sqrt(a * a + b * b);
        alpha = type1.includes("angle") ? value1 : 90 - value2;
        beta = 90 - alpha;
    } else if (type1 === "hypotenuse" && type2.includes("angle") || type1.includes("angle") && type2 === "hypotenuse") {
        let angle = type1.includes("angle") ? value1 : value2;
        c = type1 === "hypotenuse" ? value1 : value2;
        if (angle <= 0 || angle >= 90) {
            console.log("Error: Angles must be between 0 and 90 degrees.");
            return "failed";
        }
        let angleRad = angle * (Math.PI / 180);
        a = c * Math.sin(angleRad);
        b = Math.sqrt(c * c - a * a);
        alpha = type1.includes("angle") ? value1 : 90 - value2;
        beta = 90 - alpha;
    } else {
        console.log("Error: Invalid types. Please read the instructions.");
        return "failed";
    }

    console.log(`Results: a = ${a.toFixed(2)}, b = ${b.toFixed(2)}, c = ${c.toFixed(2)}`);
    console.log(`Angles: alpha = ${alpha.toFixed(2)}, beta = ${beta.toFixed(2)}`);
    return "success";
}

// Тести
console.log("Test 1: Two legs");
triangle(3, 'leg', 4, 'leg');

console.log("\nTest 2: Leg and hypotenuse");
triangle(3, 'leg', 5, 'hypotenuse');

console.log("\nTest 3: Leg and opposite angle");
triangle(3, 'leg', 30, 'adjacent angle');

console.log("\nTest 4: Hypotenuse and adjacent angle");
triangle(5, 'hypotenuse', 45, 'adjacent angle');

console.log("\nTest 5: Invalid triangle");
triangle(6, 'leg', 1, 'hypotenuse');

console.log("\nTest 6: Invalid input (negative leg)");
triangle(-3, 'leg', 4, 'leg');

console.log("\nTest 7: Invalid input (angle too large)");
triangle(3, 'leg', 100, 'opposite angle');

console.log("\nTest 8: Two angles");
triangle(30, 'adjacent angle', 60, 'opposite angle');

console.log("\nTest 9: Two legs");
triangle(5, 'leg', 12, 'leg');