package rd1.senao.com.draw.uml;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteDatabase.CursorFactory;
import android.database.sqlite.SQLiteOpenHelper;

import design.pattern.cordova.app.R;

/**
 * Created by 016121 on 2018/1/22.
 */
//https://litotom.com/2016/05/09/android%E9%AB%98%E6%95%88%E5%85%A5%E9%96%80-sqlite%E8%B3%87%E6%96%99%E5%BA%AB/

public class PlantUmlDbHelper extends SQLiteOpenHelper {

    private static PlantUmlDbHelper plantUmlDbHelper = null;
    private static final String dbName = "plantUmlDrawDb.sqlite";
    private Context context = null;

    private PlantUmlDbHelper(Context context, String dbName, CursorFactory cursorFactory, int version) {
        super(context, dbName, cursorFactory, version);

        this.context = context;
    }

    public static PlantUmlDbHelper getInstance(Context context) {
        if (plantUmlDbHelper == null) {
            synchronized (PlantUmlDbHelper.class) {
                if (plantUmlDbHelper == null) {
                    plantUmlDbHelper = new PlantUmlDbHelper(context, dbName, null, 1);
                }
            }
        }
        return plantUmlDbHelper;
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        String createUmlDrawTableSql = this.context.getString(R.string.createUmlDrawTable);
        db.execSQL(createUmlDrawTableSql);
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        // to be continue at the next version of database ...
    }

    /*
        for debug only
     */
//    public void listAllTheRecordInTable(String tableName) {
//        Cursor cursor = getReadableDatabase().rawQuery("select * from " + tableName, new String[]{});
//
//        Log.i("### table name", tableName);
//
//        int columnCount = cursor.getColumnCount();
//
//        while (cursor.moveToNext()) {
//            for (int i = 0; i < columnCount; i++) {
//                int type = cursor.getType(i);
//                switch (type) {
//
//                    case Cursor.FIELD_TYPE_INTEGER:
//                        int intValue = cursor.getInt(i);
//                        Log.i("### integer", String.valueOf(intValue) + '\t');
//                        break;
//
//                    case Cursor.FIELD_TYPE_STRING:
//                        String strValue = cursor.getString(i);
//                        Log.i("### string", strValue + '\t');
//                        break;
//
//                    case Cursor.FIELD_TYPE_BLOB:
//                        byte[] blob = cursor.getBlob(i);
//                        if (blob != null) {
//                            Log.i("### byte array size", " " + blob.length + '\t');
//                        }
//                        break;
//                    default:
//                        Log.i("### default type", "type not found !!");
//                }
//            }
//        }
//    }
}
