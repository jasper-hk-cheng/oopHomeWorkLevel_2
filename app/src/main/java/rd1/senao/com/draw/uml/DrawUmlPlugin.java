package rd1.senao.com.draw.uml;

import android.content.ContentValues;
import android.content.Context;
import android.content.res.AssetManager;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Base64;
import android.util.Log;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.apache.cordova.PluginResult.Status;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URLConnection;
import java.util.HashMap;
import java.util.Map;

import design.pattern.cordova.app.R;

/**
 * Created by 016121 jasper on 2018/1/5.
 */
public class DrawUmlPlugin extends CordovaPlugin {

    private Context context;
    private AssetManager assetManager;
    private PlantUmlDbHelper plantUmlDbHelper;
    private SQLiteDatabase plantUmlReadableDb;
    private SQLiteDatabase plantUmlWritableDb;
    private Handler handler;
    private PUmlFileEncoder pUmlFileEncoder;
    private RemoteDrawer remoteDrawer;

    /*
        the declaration of all the constant...
     */
    private String RETURN_CODE;
    private String RETURN_CODE_NO_DATA_YET;
    private String RETURN_CODE_TEXT_DEFLATE;
    private String RETURN_CODE_REGULAR_DATA;
    private String RETURN_MESSAGE;
    private String RETURN_DATA;

    /*
        pUml style template mapping
     */
    private Map<String, String> pUmlStyleTemp = new HashMap<String, String>();

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        this.context = cordova.getActivity();
        this.assetManager = context.getAssets();
        this.plantUmlDbHelper = PlantUmlDbHelper.getInstance(context);
        this.plantUmlReadableDb = plantUmlDbHelper.getReadableDatabase();
        this.plantUmlWritableDb = plantUmlDbHelper.getWritableDatabase();
        this.handler = new DrawUmlPluginHandler();
        this.pUmlFileEncoder = PUmlFileEncoder.getInstance();
        this.remoteDrawer = RemoteDrawer.getInstance(context);

        /*
            initialize all the constants...
        */
        RETURN_CODE = context.getString(R.string.return_code);
        RETURN_CODE_NO_DATA_YET = context.getString(R.string.return_code_no_data_yet);
        RETURN_CODE_TEXT_DEFLATE = context.getString(R.string.return_code_text_deflate);
        RETURN_CODE_REGULAR_DATA = context.getString(R.string.return_code_regular_data);
        RETURN_MESSAGE = context.getString(R.string.return_message);
        RETURN_DATA = context.getString(R.string.return_data);

        /*
            load the pUml style template
        */
        try {
            String styleTempDirPath = context.getString(R.string.p_uml_style_temp);
            String[] allStyleTemp = assetManager.list(styleTempDirPath);

            for (String tempFileName : allStyleTemp) {
                String tempFileContentText = getPUmlContentText(styleTempDirPath + "/", tempFileName);

                int the1stLineLen = tempFileContentText.indexOf(System.lineSeparator());
                String the1stLine = tempFileContentText.substring(0, the1stLineLen);
                String id = the1stLine
                        .replace("@startuml", "")
                        .replace("(", "")
                        .replace(")", "")
                        .replace("id", "").replace("=", "").trim();
                pUmlStyleTemp.put(id, tempFileContentText);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public boolean execute(String action, JSONArray argJsonArray, CallbackContext callbackContext) throws JSONException {

        if ("drawTheUml".equals(action)) {
            try {
                // get the file name
                JSONObject argJsonObj = argJsonArray.getJSONObject(0);
                String fileName = argJsonObj.optString("fileName");

                /*
                    select from db at the first
                 */
                String getByteByFileNameSql = context.getString(R.string.getByteByFileName);
                Cursor cursorFileByte = plantUmlReadableDb.rawQuery(getByteByFileNameSql, new String[]{fileName});

                int cursorFileByteCount = cursorFileByte.getCount();
                if (cursorFileByteCount == 0) {
                    /*
                        get pUml file text from asset dir (file system)
                     */
                    // get the file input stream
                    String P_UML_FILE_DIR = context.getString(R.string.p_uml_file_dir);
                    String pUmlFileContent = getPUmlContentText(P_UML_FILE_DIR, fileName);

                    /*
                        send the content text to web page to deflate by "rawDeflate.js"
                    */
                    JSONObject resultJson = new JSONObject();
                    resultJson.put(RETURN_CODE, RETURN_CODE_TEXT_DEFLATE);
                    resultJson.put(RETURN_MESSAGE, "we need to deflate the text with rawDeflate.js algorithm !!");
                    resultJson.put(RETURN_DATA, pUmlFileContent);
                    resultJson.put(context.getString(R.string.file_name), fileName);

                    callbackContext.success(resultJson);

                    return true;

                } else if (cursorFileByte.moveToFirst()) {

                    //return the result
                    JSONObject resultJson = new JSONObject();
                    resultJson.put(RETURN_CODE, RETURN_CODE_REGULAR_DATA);
                    resultJson.put(RETURN_MESSAGE, "you got the draw from database!!");

                    byte[] fileByte = cursorFileByte.getBlob(0);

                    String strFileByteBase64 = Base64.encodeToString(fileByte, Base64.DEFAULT);
                    resultJson.put(RETURN_DATA, strFileByteBase64);

                    ByteArrayInputStream baisForGuessContentType = new ByteArrayInputStream(fileByte);
                    String contentType = URLConnection.guessContentTypeFromStream(baisForGuessContentType);
                    resultJson.put(context.getString(R.string.content_type), contentType);

                    callbackContext.success(resultJson);

                    return true;
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        if ("contentTextDeflated".equals(action)) {

            JSONObject argJsonObj = argJsonArray.getJSONObject(0);
            String fileName = argJsonObj.optString("fileName");
            String deflatedResult = argJsonObj.optString("deflatedResult");

            /*
                URLEncoding, URLDecoding and base64 transferring
            */
            String encodedPUmlFileContent = pUmlFileEncoder.encodeToSend(deflatedResult);

            /*
                send to plantUml official web site to draw
             */
            remoteDrawer.getFileByteOnNetwork(fileName, encodedPUmlFileContent, handler, callbackContext);

            /*
                return to web view a temporary information
             */
            JSONObject resultJson = new JSONObject();
            resultJson.put(RETURN_CODE, RETURN_CODE_NO_DATA_YET);
            resultJson.put(RETURN_MESSAGE, "please wait for remote drawing!!");

            PluginResult pluginResult = new PluginResult(Status.NO_RESULT, resultJson);
            pluginResult.setKeepCallback(true);

            callbackContext.sendPluginResult(pluginResult);

            return true;
        }

        return false;
    }

    private String getPUmlContentText(String fileDirectory, String fileName) throws Exception {

        String pUmlFileUrl = new StringBuffer(fileDirectory).append(fileName).toString();
        InputStream pUmlFileInputStream = assetManager.open(pUmlFileUrl, AssetManager.ACCESS_STREAMING);

        //get the whole string of the file
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(pUmlFileInputStream));
        StringBuffer fileContentBuffer = new StringBuffer();

        String strRead = null;
        do {
            strRead = bufferedReader.readLine();
            if (strRead == null) {
                break;
            }
            // load the style template
            if (strRead.length() > 0 && strRead.startsWith("!include")) {
                String[] tempInfoArray = strRead.replaceAll("\\s+", " ").split(" ");
                String idInfoString = tempInfoArray[2];

                //remove the first exclamation
                String id = idInfoString.substring(1, idInfoString.length());
                String styleTempContentText = pUmlStyleTemp.get(id);

                fileContentBuffer.append(styleTempContentText);
            } else {
                fileContentBuffer.append(strRead);
            }
            fileContentBuffer.append(System.lineSeparator());
        } while (true);

        return fileContentBuffer.toString();
    }

    class DrawUmlPluginHandler extends Handler {

        private static final int HANDLER_INTO_DB = 0b0001;

        @Override
        public void handleMessage(Message message) {
            switch (message.what) {

                case HANDLER_INTO_DB:
                    String columnLabelFileName = context.getString(R.string.col_label_file_name);
                    String columnLabelFileByte = context.getString(R.string.col_label_file_byte);

                    Bundle messageBundle = message.getData();
                    String fileName = messageBundle.getString(columnLabelFileName);
                    byte[] fileByte = messageBundle.getByteArray(columnLabelFileByte);

                    ContentValues fileByteToInsert = new ContentValues();
                    fileByteToInsert.put(columnLabelFileName, fileName);
                    fileByteToInsert.put(columnLabelFileByte, fileByte);

                    DrawUmlPlugin.this.plantUmlWritableDb.insert("umlDraw", "desc", fileByteToInsert);

                    //test
//                    DrawUmlPlugin.this.plantUmlDbHelper.listAllTheRecordInTable("umlDraw");

                    break;

                default:
                    Log.i("Handler exception", "no such kind of message handler mode...");
            }
        }
    }
}
