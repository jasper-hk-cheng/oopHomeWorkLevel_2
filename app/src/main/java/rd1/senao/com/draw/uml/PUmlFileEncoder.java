package rd1.senao.com.draw.uml;

/**
 * Created by jasper on 2018/1/22.
 */

public class PUmlFileEncoder {

    private static PUmlFileEncoder pUmlFileEncoder = null;

    private PUmlFileEncoder() {
    }

    public static PUmlFileEncoder getInstance() {
        if (pUmlFileEncoder == null) {
            synchronized (PUmlFileEncoder.class) {
                if (pUmlFileEncoder == null) {
                    pUmlFileEncoder = new PUmlFileEncoder();
                }
            }
        }
        return pUmlFileEncoder;
    }

    /*
        example
    */
    // input parameter : "abc"
    //
    // 11 12 13 14 15 16 17
    //
    // 21 22 23 24 25 26 27
    //
    // 31 32 33 34 35 36 37
    //
    // ----------------------------------
    //
    // output result : OM9Z
    //
    // c1 - 00 11 12 13 14 15 - 24 - O
    //
    // c2 - 16 17 00 21 22 23 - 22 - M
    //
    // c3 - 24 25 26 27 00 31 - 09 - 9
    //
    // c4 - 32 33 34 35 36 37 - 35 - Z

    public String encodeToSend(String data) {
        //test
//        Log.i("deflatedResult : ", data);

        StringBuffer resultBuffer = new StringBuffer();

        for (int i = 0; i < data.length(); i = i + 3) {
            // casting char to integer will let you get the unicode value of the char in
            // java language...

            String appendThreeBytesResult = null;
            if (i + 2 == data.length()) {
                // the status that it remains only two elements in the final group(data.length() % 3 == 2)
                appendThreeBytesResult = append3bytes((int) data.charAt(i), (int) data.charAt(i + 1), 0);
                resultBuffer.append(appendThreeBytesResult);

            } else if (i + 1 == data.length()) {
                // the status that it remains only one element in the final group (data.length() % 3 == 1)
                appendThreeBytesResult = append3bytes((int) data.charAt(i), 0, 0);
                resultBuffer.append(appendThreeBytesResult);

            } else {
                // the status that the data length has 3 as it's factor number (data.length() % 3 == 0)
                appendThreeBytesResult = append3bytes((int) data.charAt(i), (int) data.charAt(i + 1), (int) data.charAt(i + 2));
                resultBuffer.append(appendThreeBytesResult);
            }

            //test
//            if(i == 0){
//                Log.i("char list", "i = " + data.charAt(i) + " i+1 = " + data.charAt(i + 1) + " i+2 = " + data.charAt(i + 2));
//                Log.i("r: " + i + "~" + (i + 3), resultBuffer.toString());
//            }

        }
        return resultBuffer.toString();
    }

    private String append3bytes(int b1, int b2, int b3) {

        //test
//        Log.i("append3bytes param", "b1 = " + b1 + " b2 = " + b2 + " b3 = " + b3);

        int c1 = b1 >> 2;
        int c2 = ((b1 & 0b0011) << 4) | (b2 >> 4);
        int c3 = ((b2 & 0b1111) << 2) | (b3 >> 6);
        int c4 = b3 & 0b00111111;

        StringBuffer resultBuffer = new StringBuffer();

        resultBuffer.append(encode6bit(c1 & 0b00111111));
        resultBuffer.append(encode6bit(c2 & 0b00111111));
        resultBuffer.append(encode6bit(c3 & 0b00111111));
        resultBuffer.append(encode6bit(c4 & 0b00111111));

        //test
//        Log.i("append3bytes r = ", resultBuffer.toString());

        return resultBuffer.toString();

        // int c1 = b1 >> 2;
        // int c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
        // int c3 = ((b2 & 0xF) << 2) | (b3 >> 6);
        // int c4 = b3 & 0x3F;
        // String r = "";
        // r += encode6bit(c1 & 0x3F);
        // r += encode6bit(c2 & 0x3F);
        // r += encode6bit(c3 & 0x3F);
        // r += encode6bit(c4 & 0x3F);
        // return r;
    }

    private String encode6bit(int b) {
        if (b < 10) {
            return String.valueOf((char) (48 + b));
        } else if (b >= 10 && b < 36) {
            return String.valueOf((char) (65 + b - 10));
        } else if (b >= 36 && b < 62) {
            return String.valueOf((char) (97 + b - 26 - 10));
        } else if (b == 62) {
            return "-";
        } else if (b == 63) {
            return "_";
        }
        return "?";

		/*
         * original design
		 */
        // if (b < 10) {
        // return (char) (48 + b);
        // }
        // b -= 10;
        // if (b < 26) {
        // return (char) (65 + b);
        // }
        // b -= 26;
        // if (b < 26) {
        // return (char) (97 + b);
        // }
        // b -= 26;
        // if (b == 0) {
        // return '-';
        // }
        // if (b == 1) {
        // return '_';
        // }
        // return '?';
    }
}
