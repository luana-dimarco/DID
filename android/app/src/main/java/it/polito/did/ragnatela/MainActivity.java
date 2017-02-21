package it.polito.did.ragnatela;

import android.app.Activity;
import android.os.Bundle;
import android.os.Handler;
import android.os.HandlerThread;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.widget.Button;
import android.widget.EditText;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;

import butterknife.BindView;
import butterknife.BindViews;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Unbinder;
import okhttp3.FormBody;
import okhttp3.HttpUrl;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class MainActivity extends Activity {

    Unbinder unbinder;
    OkHttpClient okHttpClient = new OkHttpClient();

    private String host_url = "192.168.1.32";
    private int host_port = 8080;

    @BindView(R.id.test_post_button)
    Button test_post_button;

    @BindView(R.id.random_colors)
    Button randomColors;

    @BindViews({R.id.first_byte_ip, R.id.second_byte_ip, R.id.third_byte_ip, R.id.fourth_byte_ip})
    List<EditText> ip_address_bytes;

    @BindView(R.id.host_port)
    EditText hostPort;
    private TextWatcher myIpTextWatcher;
    private JSONArray pixels_array;

    private Handler mHandler = null;

    private HandlerThread mHandlerThread = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main_activity);
        unbinder = ButterKnife.bind(this);

        test_post_button.setEnabled(false);

        myIpTextWatcher = new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {

                if (checkCorrectIp())
                    test_post_button.setEnabled(true);
            }

            @Override
            public void afterTextChanged(Editable s) {
            }
        };

        for (EditText ip_byte : ip_address_bytes) {
            ip_byte.addTextChangedListener(myIpTextWatcher);
        }

        hostPort.addTextChangedListener(myIpTextWatcher);

        startHandlerThread();
    }

    public void startHandlerThread() {
        mHandlerThread = new HandlerThread("HandlerThread");
        mHandlerThread.start();
        mHandler = new Handler(mHandlerThread.getLooper());
    }

    private boolean checkCorrectIp() {
        StringBuilder sb = new StringBuilder();
        int port;

        if (hostPort.getText().length() == 0)
            return false;

        for (EditText editText : ip_address_bytes) {
            sb.append(editText.getText().toString());
            sb.append(".");
        }
        //cancello l'ultimo "."
        sb.deleteCharAt(sb.length() - 1);

        port = Integer.parseInt(hostPort.getText().toString());
        if (validIP(sb.toString()) && port > 0 & port < 65535) {
            host_url = sb.toString();
            host_port = port;
            return true;
        } else
            return false;
    }

    //from http://stackoverflow.com/questions/4581877/validating-ipv4-string-in-java
    public static boolean validIP(String ip) {
        try {
            if (ip == null || ip.isEmpty()) {
                return false;
            }

            String[] parts = ip.split("\\.");
            if (parts.length != 4) {
                return false;
            }

            for (String s : parts) {
                int i = Integer.parseInt(s);
                if ((i < 0) || (i > 255)) {
                    return false;
                }
            }
            if (ip.endsWith(".")) {
                return false;
            }

            return true;
        } catch (NumberFormatException nfe) {
            return false;
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        unbinder.unbind();
    }

    public static final MediaType JSON
            = MediaType.parse("application/json; charset=utf-8");


    @OnClick(R.id.random_colors)
    void setRandomColors() {
        mHandler.post(new Runnable() {
            @Override
            public void run() {
                JSONObject tmp;

                try {
                    preparePixelsArray();

                    for (int i = 0; i < pixels_array.length(); i++) {
                        ((JSONObject) pixels_array.get(i)).put("r", (int) (Math.random() * 255.0f));
                        ((JSONObject) pixels_array.get(i)).put("g", (int) (Math.random() * 255.0f));
                        ((JSONObject) pixels_array.get(i)).put("b", (int) (Math.random() * 255.0f));
                    }
                    RequestBody body = new FormBody.Builder()
                            .add("pixels", pixels_array.toString())
                            .build();
                    Request request = new Request.Builder()
                            .url(new HttpUrl.Builder()
                                    .scheme("http")
                                    .host(host_url)
                                    .port(host_port).build().toString() + "setPixels")
                            .addHeader("content-type", "application/json; charset=utf-8")
                            .post(body)
                            .build();

                    Response response = okHttpClient.newCall(request).execute();
                    Log.d("TEST_POST", response.body().string());
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }

    @OnClick(R.id.test_post_button)
    void testPostButton() {
        mHandler.post(new Runnable() {
            @Override
            public void run() {
                try {
                    preparePixelsArray();

                    for (int i = 0; i < pixels_array.length(); i++) {
                        ((JSONObject) pixels_array.get(i)).put("r", (int) (Math.random() * 255.0f));
                        ((JSONObject) pixels_array.get(i)).put("g", (int) (Math.random() * 255.0f));
                        ((JSONObject) pixels_array.get(i)).put("b", (int) (Math.random() * 255.0f));
                    }
                    RequestBody body = new FormBody.Builder()
                            .add("pixels", pixels_array.toString())
                            .build();
                    Request request = new Request.Builder()
                            .url(new HttpUrl.Builder()
                                    .scheme("http")
                                    .host(host_url)
                                    .port(host_port).build().toString() + "setDisplayPixels")
                            .addHeader("content-type", "application/json; charset=utf-8")
                            .post(body)
                            .build();

                    Response response = okHttpClient.newCall(request).execute();
                    Log.d("TEST_POST", response.body().string());
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }

    @OnClick(R.id.change_color_button)
    void changeColor() {
        mHandler.post(new Runnable() {
            @Override
            public void run() {

                try {
                    preparePixelsArray();

                    RequestBody body = new FormBody.Builder()
                            .add("pixels", pixels_array.toString())
                            .build();
                    Request request = new Request.Builder()
                            .url(new HttpUrl.Builder()
                                    .scheme("http")
                                    .host(host_url)
                                    .port(host_port).build().toString() + "setPixels")
                            .addHeader("content-type", "application/json; charset=utf-8")
                            .post(body)
                            .build();

                    Response response = okHttpClient.newCall(request).execute();
                    Log.d("TEST_POST", response.body().string());
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }


    @OnClick(R.id.move_forward_button)
    void movePixelsForward() {
        mHandler.post(new Runnable() {
            @Override
            public void run() {

                try {

                    JSONArray jsonArray = new JSONArray();


                    for (int i = 0; i < pixels_array.length(); i++) {
                        jsonArray.put(pixels_array.get((i + pixels_array.length() - 10) % pixels_array.length()));
                    }
                    pixels_array = jsonArray;
                    RequestBody body = new FormBody.Builder()
                            .add("pixels", pixels_array.toString())
                            .build();
                    Request request = new Request.Builder()
                            .url(new HttpUrl.Builder()
                                    .scheme("http")
                                    .host(host_url)
                                    .port(host_port).build().toString() + "setPixels")
                            .addHeader("content-type", "application/json; charset=utf-8")
                            .post(body)
                            .build();
                    Response response = okHttpClient.newCall(request).execute();
                    Log.d("TEST_POST", response.body().string());

                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }

    @OnClick(R.id.move_back_button)
    void movePixelsBackward() {
        mHandler.post(new Runnable() {
            @Override
            public void run() {

                try {

                    JSONArray jsonArray = new JSONArray();


                    for (int i = 0; i < pixels_array.length(); i++) {
                        jsonArray.put(pixels_array.get((i + 10) % pixels_array.length()));
                    }
                    pixels_array = jsonArray;
                    RequestBody body = new FormBody.Builder()
                            .add("pixels", pixels_array.toString())
                            .build();
                    Request request = new Request.Builder()
                            .url(new HttpUrl.Builder()
                                    .scheme("http")
                                    .host(host_url)
                                    .port(host_port).build().toString() + "setPixels")
                            .addHeader("content-type", "application/json; charset=utf-8")
                            .post(body)
                            .build();
                    Response response = okHttpClient.newCall(request).execute();
                    Log.d("TEST_POST", response.body().string());
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }

    void preparePixelsArray() throws JSONException {
        pixels_array = new JSONArray();
        JSONObject tmp;

        for (int i = 0; i < 1072; i++) {
            tmp = new JSONObject();
            tmp.put("a", 0);
            if (i < 522) {
                tmp.put("g", 255);
                tmp.put("b", 0);
                tmp.put("r", 0);
            } else if (i < 613) {
                tmp.put("r", 255);
                tmp.put("g", 0);
                tmp.put("b", 0);
            } else if (i < 791) {
                tmp.put("b", 255);
                tmp.put("g", 0);
                tmp.put("r", 0);
            } else {
                tmp.put("b", 255);
                tmp.put("g", 0);
                tmp.put("r", 255);
            }
            pixels_array.put(tmp);
        }
    }

}
