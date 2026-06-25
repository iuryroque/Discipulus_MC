package com.os.unirios.security.exceptions;

public class UnAuthorized extends RuntimeException {

	private static final long serialVersionUID = 1L;
	
	public UnAuthorized(String msg) {
		super(msg);
	}
	
	public UnAuthorized(String msg, Throwable cause) {
		super(msg, cause);
	}
}
