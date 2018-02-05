package rd1.senao.com.draw.uml;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Handler;
import android.widget.Toast;

import org.apache.cordova.CallbackContext;

/**
 * Created by 016121 on 2018/1/23.
 */

public class RemoteDrawer {

    private static RemoteDrawer remoteDrawer = null;

    private Context context = null;

    private RemoteDrawer(Context context) {
        this.context = context;
    }

    public static RemoteDrawer getInstance(Context context) {
        if (remoteDrawer == null) {
            synchronized (RemoteDrawer.class) {
                if (remoteDrawer == null) {
                    remoteDrawer = new RemoteDrawer(context);
                }
            }
        }
        return remoteDrawer;
    }

    public void getFileByteOnNetwork(String fileName, String encodedPUmlFileContent, Handler handler, CallbackContext callbackContext) {
        /*
            check network status
         */
        ConnectivityManager connectivityManager = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = connectivityManager.getActiveNetworkInfo();
        if (networkInfo != null && networkInfo.isConnected()) {

            // draw at remote (plantUml offical web site)
            new PUmlContentSender(fileName, context, handler, callbackContext).execute(encodedPUmlFileContent);
        } else {
            Toast.makeText(context, "the network connection is not available now !! so, the draw task was aborted.", Toast.LENGTH_LONG).show();
        }
    }
}
