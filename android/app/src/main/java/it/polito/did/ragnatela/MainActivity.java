package it.polito.did.ragnatela;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;

import java.io.IOException;

import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

/**
 * Created by Jetmir on 20/02/2017.
 */

public class MainActivity extends Activity {

    Unbinder unbinder;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main_activity);
        unbinder = ButterKnife.bind(this);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        unbinder.unbind();
    }

    public static final MediaType JSON
            = MediaType.parse("application/json; charset=utf-8");

    @OnClick(R.id.test_post_button)
    void testPostButton() {
        OkHttpClient okHttpClient = new OkHttpClient();

        RequestBody body = RequestBody.create(JSON, "{\"prova\":1}");
        Request request = new Request.Builder()
                .url("localhost")
                .post(body)
                .build();


        try {
            Response response = okHttpClient.newCall(request).execute();
            Log.d("TEST_POST", response.body().string());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
