package com.os.unirios.security.exceptions;

public class UnAuthenticated extends RuntimeException {

    private static final long serialVersionUID = 1L;
	
	public UnAuthenticated(String msg) {
		super(msg);
	}
	
	public UnAuthenticated(String msg, Throwable cause) {
		super(msg, cause);
	}
    
}
