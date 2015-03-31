package it.unimore.awd.controllers;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;

@SuppressWarnings("serial")
public class LoginController extends Controller {

    public static final String ctrlName = "login";

    public void login() throws IOException, ServletException
    {
        Map<String, Object> root = new HashMap<String, Object>();
        root.put("message","Login/index");
        TemplateHelper.callTemplate(cfg,resp, ctrlName + "/login.ftl",root);
    }

}