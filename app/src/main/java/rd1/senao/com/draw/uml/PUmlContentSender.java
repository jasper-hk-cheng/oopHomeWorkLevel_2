package rd1.senao.com.draw.uml;

import android.content.Context;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Base64;
import android.widget.Toast;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.json.JSONObject;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.net.URLConnection;

import design.pattern.cordova.app.R;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okio.BufferedSource;

/**
 * Created by 016121 on 2018/1/23.
 */
public class PUmlContentSender extends AsyncTask<String, Integer, byte[]> {

    private final OkHttpClient okHttpClient = new OkHttpClient();

    private String fileName;
    private Context context;
    private Handler handler;
    private CallbackContext callbackContext;

    /*
       the declaration of all the constant...
    */
    //url for remote drawing
    private String DRAW_P_UML_URL;
    //return status label
    private String RETURN_CODE;
    private String RETURN_CODE_NO_DATA_YET;
    private String RETURN_CODE_REGULAR_DATA;
    private String RETURN_MESSAGE;
    private String RETURN_DATA;
    //the handler's action
    private int HANDLER_INTO_DB;

    public PUmlContentSender(String fileName, Context context, Handler handler, CallbackContext callbackContext) {
        this.fileName = fileName;
        this.context = context;
        this.handler = handler;
        this.callbackContext = callbackContext;

        /*
            initialize all the constants...
         */
        //url for remote drawing
        DRAW_P_UML_URL = context.getString(R.string.draw_p_uml_url);
        //return status label
        RETURN_CODE = context.getString(R.string.return_code);
        RETURN_CODE_NO_DATA_YET = context.getString(R.string.return_code_no_data_yet);
        RETURN_CODE_REGULAR_DATA = context.getString(R.string.return_code_regular_data);
        RETURN_MESSAGE = context.getString(R.string.return_message);
        RETURN_DATA = context.getString(R.string.return_data);
        //the handler's action
        HANDLER_INTO_DB = Integer.parseInt(context.getString(R.string.handler_into_db), 2);
    }

    //----------------------------------------------------

    @Override
    protected void onPreExecute() {

    }

    @Override
    protected byte[] doInBackground(String... fileContentArray) {

        String url = new StringBuffer(DRAW_P_UML_URL).append(fileContentArray[0]).toString();

        Request request = new Request.Builder().url(url).build();
        try {
            Response response = okHttpClient.newCall(request).execute();
            BufferedSource bufferSource = response.body().source();

            byte[] fileByteArray = bufferSource.readByteArray();
            return fileByteArray;

        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    protected void onProgressUpdate(Integer... progress) {

    }

    @Override
    protected void onPostExecute(byte[] fileByteArray) {

        try {
            if (fileByteArray != null && fileByteArray.length > 0) {
                /*
                    feedback the file byte array on the main thread...
                */
                JSONObject resultJson = new JSONObject();
                resultJson.put(RETURN_CODE, RETURN_CODE_REGULAR_DATA);
                resultJson.put(RETURN_MESSAGE, "getting data(base64 string) from remote successfully!!");

                String strFileByteBase64 = Base64.encodeToString(fileByteArray, Base64.DEFAULT);
                resultJson.put(RETURN_DATA, strFileByteBase64);

                ByteArrayInputStream baisForGuessContentType = new ByteArrayInputStream(fileByteArray);
                String fileByteContentType = URLConnection.guessContentTypeFromStream(baisForGuessContentType);
                resultJson.put(context.getString(R.string.content_type), fileByteContentType);

                PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, resultJson);
                pluginResult.setKeepCallback(false);

                callbackContext.sendPluginResult(pluginResult);

                 /*
                    persistent the file byte array on another thread...
                 */
                Runnable runPersistentIntoDatabase = () -> {
                    Message messagePersistentIntoDatabase = Message.obtain();
                    messagePersistentIntoDatabase.what = HANDLER_INTO_DB;

                    Bundle bundle = new Bundle();
                    bundle.putString(context.getString(R.string.col_label_file_name), this.fileName);
                    bundle.putByteArray(context.getString(R.string.col_label_file_byte), fileByteArray);
                    messagePersistentIntoDatabase.setData(bundle);

                    PUmlContentSender.this.handler.sendMessage(messagePersistentIntoDatabase);
                };
                runPersistentIntoDatabase.run();

            } else {
                JSONObject resultJson = new JSONObject();
                resultJson.put(RETURN_CODE, RETURN_CODE_NO_DATA_YET);
                resultJson.put(RETURN_MESSAGE, "getting data from remote fail!!");

                PluginResult pluginResult = new PluginResult(PluginResult.Status.NO_RESULT, resultJson);
                pluginResult.setKeepCallback(true);
                callbackContext.sendPluginResult(pluginResult);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void onCancelled(byte[] fileByteArray) {
        Toast.makeText(context, "the task - draw remote, was cancelled", Toast.LENGTH_LONG).show();
    }
}
