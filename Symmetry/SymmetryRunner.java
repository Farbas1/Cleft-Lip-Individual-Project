/**
 * This is the class that you should run to demo the symmetry score app.
 * 
 * @author harrystrange
 *
 */

public class SymmetryRunner {

	public static void main(String[] args) {
		SymmetryCalculator calc = new SymmetryCalculator(FILEPATH_OF_YOUR_IMAGE);
		float symmetryScore = calc.computeNaiveScore();
		
		System.out.println("Computed Symmetry Score as " + symmetryScore + "%");
	}
}
