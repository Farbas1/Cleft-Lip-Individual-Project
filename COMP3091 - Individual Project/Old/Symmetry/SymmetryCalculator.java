/**
 * A simply symmetry calculator that returns the overlap percentage of a segmented image.
 * 
 *  * @author harrystrange
 *  
 */
import java.awt.geom.AffineTransform;
import java.awt.image.AffineTransformOp;
import java.awt.image.BufferedImage;
import java.awt.image.Raster;
import java.awt.image.WritableRaster;
import java.io.File;

import javax.imageio.ImageIO;

public class SymmetryCalculator {

	// The segmented image is loaded into this BufferedImage
	private BufferedImage baseImg;
	
	public SymmetryCalculator(String imageLocation) {
		try {
			// We need to convert the segmented image into a binary representation such that the background pixels
			// take the value of 0 and segmented regions take the value of 1.  We do this by loading the image
			// into a temporary bufferedimage and then updating the raster of a new grayscale type image.
			BufferedImage loadedImg = ImageIO.read(new File(imageLocation));
			
			// Create the image onto which we will write the new pixel values
			baseImg = new BufferedImage(loadedImg.getWidth(), loadedImg.getHeight(), BufferedImage.TYPE_BYTE_GRAY);
			WritableRaster newRaster = baseImg.getRaster();
			
			int[] blackPixel = {0, 0, 0};
			int[] whitePixel = {1, 1, 1};
			
			// Now we need to convert to a binary mask
			for (int x = 0; x < baseImg.getWidth(); x++) {
				for (int y = 0; y < baseImg.getHeight(); y++) {
					if (loadedImg.getRGB(x, y) == 0) {			// Background
						newRaster.setPixel(x, y, blackPixel);
					} else {									// Segmented region
						newRaster.setPixel(x, y, whitePixel);
					}
				}
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public float computeNaiveScore() {
		// -1 is used as a general error code if anything goes wrong in computing of the score
		if (baseImg == null) 
			return -1f;
				
		// Since we are splitting down the middle we need to find that mid point
		int halfWidth = Math.round(((float) baseImg.getWidth())/2);
		
		// Get the two halves of the image
		BufferedImage left = baseImg.getSubimage(0, 0, halfWidth, baseImg.getHeight());
		BufferedImage right = baseImg.getSubimage(halfWidth, 0, baseImg.getWidth() - halfWidth, baseImg.getHeight());
		
		// Now flip the right hand image by applying an affine transformation that flips horizontally
		AffineTransform tx = AffineTransform.getScaleInstance(-1, 1);
		tx.translate(-right.getWidth(null), 0);
		// Nearest neighbour is important because we do not want to introduce any anti-aliasing artefacts that might 
		// occur as a result of interpolation methods
		AffineTransformOp op = new AffineTransformOp(tx, AffineTransformOp.TYPE_NEAREST_NEIGHBOR);
		right = op.filter(right, null);
		
		// To compute the symmetry score we loop over the left and right images and record the times that the pixels
		// are both 1 (overlap) or only one of the them is 1 (segmentation).  This is easier than the approach of
		// merging the two images into an overlapping image as you would need to loop over the image to count the
		// number of pixels of a certain value.  This way simply avoids creating an overlap image.		
		Raster readLeftRaster = left.getRaster();
		Raster readRightRaster = right.getRaster();
		
		// Temporary arrays to store the pixels
		int[] leftPixel = new int[3];
		int[] rightPixel = new int[3];
		
		// A count of the total number of:
		//		counts[0] -> segmented pixels 
		//		counts[1] -> overlapping pixels
		float[] counts = new float[2];
		
		// Loop over every pixel in the left and right images, updating the counts accordingly
		for (int x = 0; x < readLeftRaster.getWidth(); x++) {
			for (int y = 0; y < readLeftRaster.getHeight(); y++) {
				// Load the pixel values from the images' rasters and store them in the temporary pixel arrays
				readLeftRaster.getPixel(x, y, leftPixel);
				readRightRaster.getPixel(x, y, rightPixel);
				
				
				if (leftPixel[0] == 1 && rightPixel[0] == 1) 	// Overlapping region
					counts[1]++;
				if (leftPixel[0] == 1 || rightPixel[0] == 1)	// Segmented region
					counts[0]++;
			}
		}
		
		// This is only a naive score for symmetry percentage which is the proportion of overlapping pixels to
		// the total number of segmented pixels		
		float overlapPercentage = 100 * (counts[1] / (counts[0] + counts[1]));
		
		return overlapPercentage;
		
	}

}